import { Highlights } from "../common/highlights";
import { Move } from "../common/types";

export class ChessComHighlights extends Highlights {
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
