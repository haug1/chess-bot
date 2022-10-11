import { startServer } from "../../src/server.js";
import { initializeStockfish } from "../../src/stockfish/stockfish.js";
import { post } from "../utils/http.js";

const FEN = "rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2";

export class ServerTests {
  async before() {
    await initializeStockfish();
    await startServer();
  }

  async test_200ExpectedResponseWhenRequestOk() {
    return {
      result: JSON.parse(
        await post(
          "http://localhost:8080/",
          JSON.stringify({ moves: [] }),
          "application/json"
        )
      ),
      expectedResult: {
        moves: {
          bestmove: { from: { x: 5, y: "2" }, to: { x: 5, y: "4" } },
          ponder: { from: { x: 5, y: "7" }, to: { x: 5, y: "5" } },
        },
        raw: "bestmove e2e4 ponder e7e5",
      },
    };
  }

  async test_415WhenContentTypeIsMissing() {
    let message;
    try {
      await post("http://localhost:8080/", FEN);
    } catch (e) {
      message = e.message;
    }
    return {
      result: message,
      expectedResult: "HTTP status code 415",
    };
  }

  async test_500WhenUnprocessableRequest() {
    let message;
    try {
      await post(
        "http://localhost:8080/",
        JSON.stringify({ test: FEN }),
        "application/json"
      );
    } catch (e) {
      message = e.message;
    }
    return {
      result: message,
      expectedResult: "HTTP status code 500",
    };
  }
}
