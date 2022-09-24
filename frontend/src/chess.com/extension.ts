import { ChessbotExtension } from "../common/extension";
import { ChessComHighlights } from "./highlights";
import { ChessComStatusContainer } from "./status-container";

export class ChessComExtension extends ChessbotExtension {
  constructor() {
    console.log("Chess.com extension loading");
    super(new ChessComStatusContainer(), new ChessComHighlights());
  }

  get observingElement(): Node {
    return document.querySelector("vertical-move-list") as Node;
  }

  scrapeMoves(): string[] {
    let moves: string[] = [];
    for (const element of document.querySelectorAll(".move .node"))
      if (element.textContent) moves.push(element.textContent);
    return moves;
  }

  isGame() {
    return !!document.querySelector("vertical-move-list");
  }
}
