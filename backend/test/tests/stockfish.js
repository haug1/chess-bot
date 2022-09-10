import {
  getBestMoveBasedOnFEN,
  initializeStockfish,
} from "../../src/stockfish.js";

export class StockfishTests {
  async before() {
    await initializeStockfish();
  }

  async test_getBestMoveBasedOnFEN() {
    return {
      result: await getBestMoveBasedOnFEN(
        "rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2"
      ),
      expectedResult: "bestmove e2e4 ponder b8c6",
    };
  }
}
