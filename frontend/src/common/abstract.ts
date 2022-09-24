import { Chess } from "chess.js";
import { StockfishClient } from "./stockfish-client";
import { Move } from "./types";

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
  abstract get observingElement(): Node;

  private main() {
    setTimeout(() => {
      this.onMove();
      this.observeMoves();
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

export abstract class StatusContainer {
  private static readonly ELEMENT_ID = "status-container";

  abstract mount(element: HTMLDivElement): void;

  private element = document.querySelector<HTMLDivElement>(
    "#" + StatusContainer.ELEMENT_ID
  );

  get exists() {
    return !!this.element;
  }

  public update(msg: string, borderColor = "black", borderWidth = "2px") {
    if (!this.element) this.element = this.createElement();
    this.element.style.borderColor = borderColor;
    this.element.style.borderWidth = borderWidth;
    this.element.innerText = msg;
  }

  private createElement() {
    const element = document.createElement("div");
    element.id = StatusContainer.ELEMENT_ID;
    element.style.borderWidth = "2px";
    element.style.borderStyle = "solid";
    element.style.borderColor = "black";
    element.style.padding = "5px";

    this.mount(element);

    return element;
  }
}

export abstract class Highlights {
  private static readonly BEST_MOVE_ID = "bestmove-highlight";
  private static readonly PONDER_ID = "ponder-highlight";
  private static readonly FROM_ID = "-from";
  private static readonly TO_ID = "-to";
  private static readonly PONDER_HIGHLIGHT_COLOR = "rgb(245, 42, 42)"; // red
  private static readonly BESTMOVE_HIGHLIGHT_COLOR = "rgb(68, 255, 0)"; // green

  abstract updatePosition(
    highlight: { from: Element | null; to: Element | null },
    move: Move
  );
  abstract createHighlightElement(id: string, color: string): Element;
  abstract mount(element: Element): void;

  private bestmove = {
    from: document.querySelector<Element>(
      "#" + Highlights.BEST_MOVE_ID + Highlights.FROM_ID
    ),
    to: document.querySelector<Element>(
      "#" + Highlights.BEST_MOVE_ID + Highlights.TO_ID
    ),
  };
  private ponder = {
    from: document.querySelector<Element>(
      "#" + Highlights.PONDER_ID + Highlights.FROM_ID
    ),
    to: document.querySelector<Element>(
      "#" + Highlights.PONDER_ID + Highlights.TO_ID
    ),
  };

  get exists() {
    return !!this.bestmove.from;
  }

  public update(
    positions?: {
      bestmove?: Move;
      ponder?: Move;
    },
    hide = false
  ) {
    if (!this.exists) {
      this.createAll();
    }

    if (positions) {
      if (positions.bestmove) {
        this.updatePosition(this.bestmove, positions.bestmove);
      }
      if (positions.ponder) {
        this.updatePosition(this.ponder, positions.ponder);
      }
    }

    if (hide) {
      this.hideAll();
    } else {
      this.showAll();
    }
  }

  private createAll() {
    this.bestmove.from = this.createHighlight(
      Highlights.BEST_MOVE_ID + Highlights.FROM_ID,
      Highlights.BESTMOVE_HIGHLIGHT_COLOR
    );
    this.bestmove.to = this.createHighlight(
      Highlights.BEST_MOVE_ID + Highlights.TO_ID,
      Highlights.BESTMOVE_HIGHLIGHT_COLOR
    );
    this.ponder.from = this.createHighlight(
      Highlights.PONDER_ID + Highlights.FROM_ID,
      Highlights.PONDER_HIGHLIGHT_COLOR
    );
    this.ponder.to = this.createHighlight(
      Highlights.PONDER_ID + Highlights.TO_ID,
      Highlights.PONDER_HIGHLIGHT_COLOR
    );
  }

  private createHighlight(id: string, color: string) {
    const element = this.createHighlightElement(id, color);

    this.mount(element);

    return element;
  }

  private hideAll() {
    (this.bestmove.from as HTMLElement).style.opacity = "0";
    (this.bestmove.to as HTMLElement).style.opacity = "0";
    (this.ponder.from as HTMLElement).style.opacity = "0";
    (this.ponder.to as HTMLElement).style.opacity = "0";
  }

  private showAll() {
    (this.bestmove.from as HTMLElement).style.opacity = "0.5";
    (this.bestmove.to as HTMLElement).style.opacity = "0.5";
    (this.ponder.from as HTMLElement).style.opacity = "0.5";
    (this.ponder.to as HTMLElement).style.opacity = "0.5";
  }
}
