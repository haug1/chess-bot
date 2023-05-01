const {
  startEngine,
  evalPosition,
  cancelCurrentOperation,
} = require("../src/index.js");
const createFastify = require("fastify");
const pretty = require("pino-pretty").default;

const fastify = createFastify({
  logger: {
    level: process.env.DEBUG ? "debug" : undefined,
    stream: pretty({
      colorize: true,
      translateTime: true,
      ignore: "pid,hostname",
    }),
  },
});

// attach global logger
console.debug = function debug(...params) {
  fastify.log.debug(...params);
};

console.log = function log(...params) {
  fastify.log.info(...params);
};

console.error = function error(...params) {
  fastify.log.error(...params);
};

console.warn = function warn(...params) {
  fastify.log.warn(...params);
};

function getFenFromMoves(moves) {
  const chess = new Chess();
  for (const move of moves) chess.move(move);
  return chess.fen();
}

// Sample request:
// POST /moves/sse
// Content-Type: application/json
// { moves: ["e4"] }
// Returns text/event-stream
// each chunk is a stockfish evaluation,
// see `src/parser.js` for structure/details on parsing of Stockfish engine output
fastify.post("/moves/sse", async (request, reply) => {
  reply.raw.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache,no-transform",
    "x-no-compression": 1,
  });
  try {
    request.socket.on("end", () => cancelCurrentOperation());
    await evalPosition(getFenFromMoves(request.body.moves), (v) => {
      reply.raw.write(`data: ${JSON.stringify(v)}\n\n`);
    });
    reply.raw.end();
  } catch (e) {
    console.error(e);
    reply.code(500).send({ message: e.message });
  }
});

// Sample request:
// POST /fen/sse
// Content-Type: text/plain
// rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2
// Returns text/event-stream
// each chunk is a stockfish evaluation,
// see `src/parser.js` for structure/details on parsing of Stockfish engine output
fastify.post("/fen/sse", async (request, reply) => {
  reply.raw.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache,no-transform",
    "x-no-compression": 1,
  });
  try {
    request.socket.on("end", () => cancelCurrentOperation());
    await evalPosition(request.body, (v) => {
      reply.raw.write(`data: ${JSON.stringify(v)}\n\n`);
    });
    reply.raw.end();
  } catch (e) {
    console.error(e);
    reply.code(500).send({ message: e.message });
  }
});

(async function main() {
  if (fastify.server?.listening) return;
  try {
    await startEngine();
    return fastify.listen({ port: process.env.PORT || 8080 });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
