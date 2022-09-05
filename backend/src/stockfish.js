const stockfish = require("stockfish");
const { debug, log } = require("./logger.js");

function defaultMessageHandler(msg) {
  debug(msg);
}

async function initialize(engine) {
  return new Promise((resolve) => {
    engine.onmessage = (msg) => {
      defaultMessageHandler(msg);
      if (msg === "uciok") {
        engine.onmessage = defaultMessageHandler;
        resolve();
      }
    };
    engine.postMessage("uci");
  });
}

module.exports = {
  async getBestMoveBasedOnFEN(fenString) {
    log("Checking FEN: " + fenString);
    return new Promise(async (resolve) => {
      const engine = stockfish();
      await initialize(engine);
      engine.onmessage = (msg) => {
        defaultMessageHandler(msg);
        if (typeof (msg == "string") && msg.match("bestmove")) {
          log("Found best move: " + msg);
          engine.onmessage = defaultMessageHandler;
          resolve(msg);
        }
      };
      engine.postMessage("ucinewgame");
      engine.postMessage("position fen " + fenString);
      engine.postMessage("go depth 18");
    });
  },
};
