import { fetchEventSource } from "fetch-event-source";
import type { Move } from "../state";

export type StockfishResponse = {
  bestmove?: BestMove;
  evaluation?: Evaluation;
  score?: string;
  raw: string;
};

export type Evaluation = {
  friendly: Move;
  enemy?: Move;
};

export type StockfishResult = StockfishResponse & {
  refMoveCounter: number;
};

export type BestMove = {
  bestmove?: Move;
  ponder?: Move;
};

export class StockfishClient {
  private abortController?: AbortController;

  public abort() {
    this.abortController !== undefined &&
      !this.abortController.signal.aborted &&
      this.abortController.abort();
    this.abortController = undefined;
  }

  getEvaluation(
    moves: string[],
    refMoveCounter: number,
    onEvaluation: (evaluation: StockfishResult) => void
  ): Promise<void> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    return new Promise(async (resolve, reject) => {
      try {
        await fetchEventSource("http://localhost:8080/moves/sse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moves }),
          signal,
          onmessage(msg) {
            const stockfishResult: StockfishResult = JSON.parse(msg.data);
            onEvaluation({ ...stockfishResult, refMoveCounter });
          },
          onclose() {
            if (signal.aborted) {
              reject({ aborted: true });
            }
            resolve();
          },
          onerror(err) {
            reject(err);
          },
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /** retired */
  public async getBestMoveBasedOnFEN(
    moves: string[],
    refMoveCounter: number
  ): Promise<StockfishResult> {
    this.abortController = new AbortController();
    try {
      const response = await fetch("http://localhost:8080/moves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ moves }),
        signal: this.abortController.signal,
      });
      return { ...(await response.json()), refMoveCounter };
    } catch (e) {
      if (e.name === "AbortError") throw { aborted: true };
      else throw e;
    } finally {
      this.abortController = undefined;
    }
  }
}
