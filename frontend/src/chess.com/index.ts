import {
  ChessbotExtension,
  StatusContainer,
  Highlights,
} from "../common/abstract";
import { Move } from "../common/types";

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
}

class ChessComStatusContainer extends StatusContainer {
  mount(element: HTMLDivElement) {
    const container = document.querySelector(".play-controller-message");
    if (container) {
      container.insertBefore(element, container.firstChild);
    } else {
      throw new Error(
        "Failed to create status container, mounting point not found"
      );
    }
  }
}

class ChessComHighlights extends Highlights {
  mount(element: HTMLElement) {
    const board = document.querySelector("chess-board");
    if (board) {
      board.appendChild(element);
    } else {
      throw new Error("Board not found");
    }
  }

  override updatePosition(
    highlight: { from: HTMLElement | null; to: HTMLElement | null },
    { from, to }: Move
  ) {
    highlight.from!.className = `highlight square-${from.x}${from.y}`;
    highlight.to!.className = `highlight square-${to.x}${to.y}`;
  }

  override createHighlightElement(id: string, color: string): HTMLElement {
    const element = document.createElement("div");
    element.id = id;
    element.style.backgroundColor = color;
    element.style.opacity = "0.5";
    return element;
  }
}

new ChessComExtension();
