import ChessComHighlights from "../components/chess.com/Highlights.svelte";
import { ChessBotEngine } from "./base";

export class ChessComEngine extends ChessBotEngine {
  public Highlights = ChessComHighlights;

  private queryForElement(possible: string[], name: string) {
    let target: HTMLElement | null = null;
    for (const p of possible) {
      target = document.querySelector(p);
      if (target) {
        break;
      }
    }
    if (!target) throw new Error(`${name} target not found`);
    return target;
  }

  protected get highlightsTarget(): Element {
    return this.queryForElement(
      ["chess-board", "wc-chess-board"],
      "highlights target",
    );
  }

  protected get movesContainer(): Element {
    return this.queryForElement(
      ["vertical-move-list", "wc-simple-move-list"],
      "moves container",
    );
  }

  protected get statusTarget(): Element {
    const target = this.queryForElement(
      [".play-controller-message", ".play-controller-messages"],
      "status target",
    );
    const statusContainer = document.createElement("div");
    statusContainer.style.width = "100000vh";
    statusContainer.style.height = "25rem";
    target.insertBefore(statusContainer, target.firstChild);
    return statusContainer;
  }

  public isGame(): boolean {
    return !!this.movesContainer;
  }

  protected scrapeMoves(): string[] {
    return this.movesContainer
      .querySelectorAll(".node")
      .values()
      .map((n) => n.textContent.trim())
      .toArray();
  }
}
