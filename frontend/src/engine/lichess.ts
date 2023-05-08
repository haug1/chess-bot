import LichessHighlights from "../components/lichess/Highlights.svelte";
import { ChessBotEngine } from "./base";

function createSvgWrapper() {
  // <svg x="-4" y="-4" viewBox="-4 -4 8 8">
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "cg-shapes");
  svg.setAttribute("viewBox", "-4 -4 8 8");
  svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
  return svg;
}

export class LichessEngine extends ChessBotEngine {
  public Highlights = LichessHighlights;

  protected get highlightsTarget(): Element {
    const target = document.querySelector("cg-container");
    if (!target) throw new Error("Highlights target not found");
    const svg = createSvgWrapper();
    target.appendChild(svg);
    return svg;
  }

  protected get movesContainer(): Element {
    const container = document.querySelector("rm6");
    if (!container) throw new Error("Moves container not found");
    return container;
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
    for (const element of document.querySelectorAll("l4x kwdb"))
      if (element.textContent) moves.push(element.textContent);
    return moves;
  }
}
