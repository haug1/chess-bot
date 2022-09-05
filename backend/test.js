const { getBestMoveBasedOnFEN } = require("./src/stockfish");

const fen = "rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2";

(async function () {
  const start = new Date();
  const bestMove = await getBestMoveBasedOnFEN(fen);
  console.log(bestMove);
  console.log("time elapsed", new Date() - start);

  if (bestMove !== "bestmove e2e4 ponder b8c6") {
    throw Error("test.js assertion failed");
  }
})();
