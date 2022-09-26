import { Chess } from "chess.js";
import { Highlights } from "./highlights";
import { StatusContainer } from "./status-container";
import { StockfishClient } from "./stockfish-client";

export abstract class ChessbotExtension {
  private readonly _statusContainer: StatusContainer;
  private readonly _highlights: Highlights;
  private readonly _stockfish = new StockfishClient();
  private readonly _onRefreshButtonClicked = () => {
    this.moveCounter = 0;
    this.onMoveObserved();
  };

  private moveCounter = 0;

  protected abstract get movesElement(): Node;
  protected abstract scrapeMoves(): string[];
  protected abstract isGame(): boolean;

  constructor(statusContainer: StatusContainer, highlights: Highlights) {
    this._statusContainer = statusContainer;
    this._statusContainer.onRefreshButtonClicked = this._onRefreshButtonClicked;
    this._highlights = highlights;
    this.main();
  }

  private main() {
    const interval = setInterval(() => {
      if (this.isGame()) {
        clearInterval(interval);
        this.onMoveObserved();
        this.observeMoves();
      }
    }, 1000);
  }

  private observeMoves() {
    new MutationObserver(() => {
      this.onMoveObserved();
    }).observe(this.movesElement, {
      childList: true,
      subtree: true,
    });
  }

  private async onMoveObserved() {
    this.moveCounter++;
    try {
      this._stockfish.abort();
      if (this.moveCounter % 2) await this.onPlayerTurn();
      else this.onOpponentTurn();
    } catch (e) {
      if (!e.stale) {
        this._statusContainer.update({
          msg: e.aborted ? "ABORTED" : "ERROR",
          borderColor: e.aborted ? "orange" : "red",
          borderWidth: "4px",
        });
      }
      if (!e.aborted && !e.stale) throw e;
    }
  }

  private async onPlayerTurn() {
    this._statusContainer.update({
      msg: "Figuring out best move..",
      borderColor: "yellow",
    });
    const chess = new Chess();
    for (const move of this.scrapeMoves()) chess.move(move);
    const stockfishResult = await this._stockfish.getBestMoveBasedOnFEN(
      chess.fen(),
      this.moveCounter
    );

    // throw response if stale, i.e. the response was meant for an earlier game state
    const stale = this.moveCounter !== stockfishResult.refMoveCounter;
    if (stale) throw { stale };

    this._statusContainer.update({
      msg: stockfishResult.response,
      borderColor: "green",
      borderWidth: "4px",
    });
    if (stockfishResult.moves)
      this._highlights.update({
        positions: stockfishResult.moves,
        hide: false,
      });
  }

  private onOpponentTurn() {
    this._highlights.update({ hide: true });
    this._statusContainer.update({ msg: "Waiting for opponent.." });
  }
}
