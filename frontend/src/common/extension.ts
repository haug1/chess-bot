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
        console.log("Game started");
        clearInterval(interval);
        this.onMoveObserved();
        this.observeMoves();
      }
    }, 1000);
  }

  private observeMoves() {
    console.info("Start observing for moves");
    new MutationObserver(() => this.onMoveObserved()).observe(
      this.movesElement,
      {
        childList: true,
        subtree: true,
      }
    );
  }

  private async onMoveObserved() {
    try {
      // only do it on player's turn (todo(?) this is lazy & error-prone)
      if (!(this.moveCounter % 2)) {
        await this.onPlayerTurn();
      } else {
        this.onOpponentTurn();
      }
    } catch (e) {
      this._statusContainer.update({
        msg: "ERROR",
        borderColor: "red",
        borderWidth: "4px",
      });
      throw e;
    } finally {
      this.moveCounter++;
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
      chess.fen()
    );
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
    this._statusContainer.update({ msg: "Waiting.." });
  }
}
