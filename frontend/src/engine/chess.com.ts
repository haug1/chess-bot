import ChessComHighlights from "../components/chess.com/Highlights.svelte";
import { ChessBotEngine } from "./base";

export class ChessComEngine extends ChessBotEngine {
  public Highlights = ChessComHighlights;

  protected get highlightsTarget(): Element {
    const target = document.querySelector("chess-board");
    if (!target) throw new Error("Highlights target not found");
    return target;
  }

  protected get movesContainer(): Element {
    const container = document.querySelector("vertical-move-list");
    if (!container) throw new Error("Moves container not found");
    return container;
  }

  protected get statusTarget(): Element {
    const target = document.querySelector(".play-controller-message");
    if (!target) throw new Error("Status target not found");
    const statusContainer = document.createElement("div");
    statusContainer.style.width = "100000vh";
    statusContainer.style.height = "25rem";
    target.insertBefore(statusContainer, target.firstChild);
    return statusContainer;
  }

  public isGame(): boolean {
    return !!document.querySelector("vertical-move-list");
  }

  protected scrapeMoves(): string[] {
    let moves: string[] = [];
    for (const element of document.querySelectorAll(".move .node"))
      if (element.textContent) moves.push(element.textContent);
    return moves;
  }
}
