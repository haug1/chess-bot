import {
  getBestMoveBasedOnFEN,
  initializeStockfish,
} from "../../src/stockfish/stockfish.js";

export class StockfishTests {
  async before() {
    await initializeStockfish();
  }

  async test_getBestMoveBasedOnFEN() {
    return {
      result: await getBestMoveBasedOnFEN(
        "rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2"
      ),
      expectedResult: {
        moves: {
          bestmove: { from: { x: 5, y: "2" }, to: { x: 5, y: "4" } },
          ponder: { from: { x: 2, y: "8" }, to: { x: 3, y: "6" } },
        },
        raw: "bestmove e2e4 ponder b8c6",
      },
    };
  }
}
