import { ChessbotExtension } from "../common/extension";
import { LichessHighlights } from "./highlights";
import { LichessStatusContainer } from "./status-container";

export class LichessExtension extends ChessbotExtension {
  get observingElement(): Node {
    return document.querySelector("l4x") as Node;
  }

  constructor() {
    console.log("Lichess extension loading");
    super(new LichessStatusContainer(), new LichessHighlights());
  }

  scrapeMoves() {
    let moves: string[] = [];
    for (const element of document.querySelectorAll("l4x u8t"))
      if (element.textContent) moves.push(element.textContent);
    return moves;
  }
}
