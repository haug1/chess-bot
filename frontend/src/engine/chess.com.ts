import ChessComHighlights from "../components/chess.com/Highlights.svelte";
import ChessComStatus from "../components/common/Status.svelte";
import { ChessBotEngine } from "./base";

export class ChessComEngine extends ChessBotEngine {
  public Highlights = ChessComHighlights;
  public Status = ChessComStatus;

  protected get highlightsTarget(): Element {
    const target = document.querySelector("chess-board");
    if (!target) throw new Error("Highlights target not found");
    return target;
  }

  protected get movesContainer(): Element {
    return document.querySelector("vertical-move-list");
  }

  protected get statusTarget(): Element {
    const target = document.querySelector(".play-controller-message");
    if (!target) throw new Error("Status target not found");
    return target;
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
