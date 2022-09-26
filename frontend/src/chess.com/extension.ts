import { ChessbotExtension } from "../common/extension";
import { ChessComHighlights } from "./highlights";
import { ChessComStatusContainer } from "./status-container";

export class ChessComExtension extends ChessbotExtension {
  constructor() {
    super(new ChessComStatusContainer(), new ChessComHighlights());
  }

  protected override get movesElement(): Node {
    return document.querySelector("vertical-move-list") as Node;
  }

  protected override scrapeMoves(): string[] {
    let moves: string[] = [];
    for (const element of document.querySelectorAll(".move .node"))
      if (element.textContent) moves.push(element.textContent);
    return moves;
  }

  protected override isGame() {
    return !!document.querySelector("vertical-move-list");
  }
}
