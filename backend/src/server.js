import createFastify from "fastify";
import {
  getBestMoveBasedOnFEN,
  getBestMoveBasedOnMoves,
} from "./stockfish/stockfish.js";

export const fastify = createFastify({
  logger: {
    level: process.env.DEBUG ? "debug" : undefined,
    transport:
      process.env.ENV === "development"
        ? {
            target: "pino-pretty",
            options: {
              translateTime: "HH:MM:ss Z",
              ignore: "pid,hostname",
            },
          }
        : undefined,
  },
});

// Sample request:
// POST /moves/sse
// Content-Type: application/json
// { moves: ["e4"] }
// Returns text/event-stream
// each chunk is a stockfish evaluation,
// see `stockfish/parser.js` for structure
fastify.post("/moves/sse", (request, reply) => {
  reply.raw.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache,no-transform",
    "x-no-compression": 1,
  });
  getBestMoveBasedOnMoves(
    request.body.moves,
    (v) => reply.raw.write(`data: ${JSON.stringify(v)}\n\n`),
    () => reply.raw.end()
  );
});

// Sample request:
// POST /fen/sse
// Content-Type: text/plain
// rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2
// Returns text/event-stream
// each chunk is a stockfish evaluation,
// see `stockfish/parser.js` for structure
fastify.post("/fen/sse", (request, reply) => {
  reply.raw.writeHead(200, {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache,no-transform",
    "x-no-compression": 1,
  });
  getBestMoveBasedOnFEN(
    request.body,
    (v) => reply.raw.write(`data: ${JSON.stringify(v)}\n\n`),
    () => reply.raw.end()
  );
});

// Sample request:
// POST /moves
// Content-Type: application/json
// { moves: ["e4"] }
// Returns only the final bestmove evaluation (which can take a long time sometimes)
fastify.post("/moves", async (request, reply) =>
  reply.send(await getBestMoveBasedOnMoves(request.body.moves))
);

// Sample request:
// POST /fen
// Content-Type: text/plain
// rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2
// Returns only the final bestmove evaluation (which can take a long time sometimes)
fastify.post("/fen", async (request, reply) =>
  reply.send(await getBestMoveBasedOnFEN(request.body))
);

export async function startServer() {
  if (fastify.server?.listening) return;
  try {
    return fastify.listen({ port: process.env.PORT || 8080 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}
