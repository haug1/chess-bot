import { startServer } from "../../src/server.js";
import { initializeStockfish } from "../../src/stockfish.js";
import { post } from "../utils/http.js";

export class ServerTests {
  async before() {
    await initializeStockfish();
    await startServer();
  }

  async expectedResponseOnPOST() {
    return {
      result: await post(
        "http://localhost:8080/",
        "rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2"
      ),
      expectedResult: "bestmove e2e4 ponder b8c6",
    };
  }
}
