import { startServer } from "../../src/server.js";
import { initializeStockfish } from "../../src/stockfish.js";
import { post } from "../utils/http.js";

const FEN = "rnbqkbnr/pp1ppppp/8/2p5/8/3P4/PPP1PPPP/RNBQKBNR w KQkq c6 0 2";

export class ServerTests {
  async before() {
    await initializeStockfish();
    await startServer();
  }

  async test_200ExpectedResponseWhenRequestOk() {
    return {
      result: await post("http://localhost:8080/", FEN, "text/plain"),
      expectedResult: "bestmove e2e4 ponder b8c6",
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
