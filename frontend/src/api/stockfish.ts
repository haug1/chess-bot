import type { Move } from "../state";

export type StockfishResult = {
  moves: {
    bestmove?: Move;
    ponder?: Move;
  };
  response: string;
  refMoveCounter: number;
};

export class StockfishClient {
  private abortController?: AbortController;

  public abort() {
    this.abortController !== undefined &&
      !this.abortController.signal.aborted &&
      this.abortController.abort();
    this.abortController = undefined;
  }

  public async getBestMoveBasedOnFEN(fen: string, refMoveCounter: number) {
    this.abortController = new AbortController();
    try {
      const httpResponse = await fetch("http://localhost:8080", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: fen,
        signal: this.abortController.signal,
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
        refMoveCounter,
      };
    } catch (e) {
      if (e.name === "AbortError") throw { aborted: true };
      else throw e;
    } finally {
      this.abortController = undefined;
    }
  }
}
