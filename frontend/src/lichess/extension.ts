import { ChessbotExtension } from "../common/extension";
import { LichessHighlights } from "./highlights";
import { LichessStatusContainer } from "./status-container";

export class LichessExtension extends ChessbotExtension {
  protected override get movesElement(): Node {
    return document.querySelector("l4x") as Node;
  }

  constructor() {
    super(new LichessStatusContainer(), new LichessHighlights());
  }

  protected override scrapeMoves() {
    let moves: string[] = [];
    for (const element of document.querySelectorAll("l4x u8t"))
      if (element.textContent) moves.push(element.textContent);
    return moves;
  }

  protected override isGame(): boolean {
    const gameReadyElement = document.querySelector(
      ".message > div:nth-child(1)"
    );
    const gameReady =
      (gameReadyElement &&
        gameReadyElement.textContent?.includes("It's your turn!")) ||
      false;
    return !!document.querySelector("l4x") || gameReady;
  }
}
