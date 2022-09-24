import { Move } from "./types";

export class StockfishClient {
  public async getBestMoveBasedOnFEN(fen: string) {
    const httpResponse = await fetch("http://localhost:8080", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: fen,
    });
    const response = await httpResponse.text();
    let moves: {
      bestmove?: Move;
      ponder?: Move;
    } = {};
    if (response.includes("bestmove")) {
      const LOOKUP = ["a", "b", "c", "d", "e", "f", "g", "h"];
      const createXY = (boardPosition) => ({
        x: LOOKUP.indexOf(boardPosition[0]) + 1,
        y: boardPosition[1],
      });
      const createMove = (move) => ({
        from: createXY(move.substr(0, 2)),
        to: createXY(move.substr(2)),
      });
      const bestmove = response.substr(9, 4); // i.e. e2e4
      const ponder = response.substr(21); // i.e. e2e4 or empty string
      moves = {
        ...(bestmove && { bestmove: createMove(bestmove) }),
        ...(ponder && { ponder: createMove(ponder) }),
      };
    }
    return {
      moves,
      response,
    };
  }
}
