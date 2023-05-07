import { fetchEventSource } from "@microsoft/fetch-event-source";
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
    onEvaluation: (evaluation: StockfishResult) => void | Promise<void>
  ): Promise<void> {
    this.abortController = new AbortController();
    const signal = this.abortController.signal;
    const abort = this.abort;
    return new Promise(async (resolve, reject) => {
      try {
        await fetchEventSource("http://localhost:8080/moves/sse", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ moves }),
          signal,
          async onmessage(msg) {
            try {
              const response = { ...JSON.parse(msg.data), refMoveCounter };
              await onEvaluation(response);
            } catch (error) {
              abort();
              reject(error);
            }
          },
          onerror(err) {
            reject(err);
          },
          openWhenHidden: true,
        });
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }
}
