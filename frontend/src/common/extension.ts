import { Chess } from "chess.js";
import { Highlights } from "./highlights";
import { StatusContainer } from "./status-container";
import { StockfishClient } from "./stockfish-client";

export abstract class ChessbotExtension {
  private readonly statusContainer: StatusContainer;
  private readonly highlights: Highlights;
  private readonly stockfish: StockfishClient;

  private moveCounter = 0;

  constructor(statusContainer: StatusContainer, highlights: Highlights) {
    this.stockfish = new StockfishClient();
    this.statusContainer = statusContainer;
    this.highlights = highlights;
    this.main();
  }

  abstract scrapeMoves(): string[];
  abstract isGame(): boolean;
  abstract get observingElement(): Node;

  private main() {
    const interval = setInterval(() => {
      if (this.isGame()) {
        clearInterval(interval);
        this.onMove();
        this.observeMoves();
      }
    }, 1000);
  }

  private observeMoves() {
    console.info("Start observing for moves");
    new MutationObserver(() => this.onMove()).observe(this.observingElement, {
      childList: true,
      subtree: true,
    });
  }

  private async onMove() {
    try {
      // only do it on player's turn (todo(?) this is lazy & error-prone)
      if (!(this.moveCounter % 2)) {
        this.statusContainer.update("Figuring out best move..", "yellow");
        const chess = new Chess();

        for (const move of this.scrapeMoves()) chess.move(move);

        const stockfishResult = await this.stockfish.getBestMoveBasedOnFEN(
          chess.fen()
        );

        this.statusContainer.update(stockfishResult.response, "green", "4px");

        if (stockfishResult.moves)
          this.highlights.update(stockfishResult.moves);
      } else {
        // opponent's turn
        this.highlights.update(undefined, true);
        this.statusContainer.update("Waiting..");
      }
    } catch (e) {
      this.statusContainer.update("ERROR", "red", "4px");
      throw e;
    } finally {
      this.moveCounter++;
    }
  }
}
