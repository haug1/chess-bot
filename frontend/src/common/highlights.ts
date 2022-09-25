import { Move } from "./types";

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

  protected bestmove = {
    from: document.querySelector<Element>(
      "#" + Highlights.BEST_MOVE_ID + Highlights.FROM_ID
    ),
    to: document.querySelector<Element>(
      "#" + Highlights.BEST_MOVE_ID + Highlights.TO_ID
    ),
  };
  protected ponder = {
    from: document.querySelector<Element>(
      "#" + Highlights.PONDER_ID + Highlights.FROM_ID
    ),
    to: document.querySelector<Element>(
      "#" + Highlights.PONDER_ID + Highlights.TO_ID
    ),
  };

  public update(
    positions?: {
      bestmove?: Move;
      ponder?: Move;
    },
    hide = false
  ) {
    if (!this.bestmove.from) this.createAll();
    if (positions) {
      if (positions.bestmove)
        this.updatePosition(this.bestmove, positions.bestmove);
      if (positions.ponder) this.updatePosition(this.ponder, positions.ponder);
    }
    if (hide) this.hideAll();
    else this.showAll();
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

  protected showAll() {
    (this.bestmove.from as HTMLElement).style.opacity = "0.5";
    (this.bestmove.to as HTMLElement).style.opacity = "0.5";
    (this.ponder.from as HTMLElement).style.opacity = "0.5";
    (this.ponder.to as HTMLElement).style.opacity = "0.5";
  }
}
