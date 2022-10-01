import LichessHighlights from "../components/lichess/Highlights.svelte";
import LichessStatus from "../components/common/Status.svelte";
import { ChessBotEngine } from "./base";

export class LichessEngine extends ChessBotEngine {
  public Highlights = LichessHighlights;
  public Status = LichessStatus;

  protected get highlightsTarget(): Element {
    const target = document.querySelector("cg-container svg.cg-shapes g");
    if (!target) throw new Error("Highlights target not found");
    return target;
  }

  protected get movesContainer(): Element {
    return document.querySelector("l4x");
  }

  protected get statusTarget(): Element {
    const target = document.querySelector(".round__app.variant-standard");
    if (!target) throw new Error("Status target not found");
    return target;
  }

  public isGame(): boolean {
    const gameReadyElement = document.querySelector(
      ".message > div:nth-child(1)"
    );
    const gameReady =
      (gameReadyElement &&
        gameReadyElement.textContent?.includes("It's your turn!")) ||
      false;
    return !!document.querySelector("l4x") || gameReady;
  }

  protected scrapeMoves(): string[] {
    let moves: string[] = [];
    for (const element of document.querySelectorAll("l4x u8t"))
      if (element.textContent) moves.push(element.textContent);
    return moves;
  }
}
