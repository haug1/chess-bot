import {
  ChessbotExtension,
  Highlights,
  StatusContainer,
} from "../common/abstract";
import { Move } from "../common/types";

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

class LichessStatusContainer extends StatusContainer {
  mount(element: HTMLDivElement): void {
    const container = document.querySelector(".round__app.variant-standard");
    if (container) container?.appendChild(element);
    else
      throw new Error(
        "Failed to create status container, mounting point not found"
      );
  }
}

class LichessHighlights extends Highlights {
  createHighlightElement(id: string, color: string): Element {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    element.id = id;
    element.setAttributeNS(null, "cx", "0");
    element.setAttributeNS(null, "cy", "0");
    element.setAttributeNS(null, "r", "0.46875");
    element.setAttributeNS(null, "stroke-width", "0.0625");
    element.setAttributeNS(null, "stroke", color);
    element.setAttributeNS(null, "opacity", "1");
    element.setAttributeNS(null, "fill", "none");
    return element;
  }

  mount(element: Element): void {
    const container = document.querySelector("cg-container svg.cg-shapes g");
    if (container) container.appendChild(element);
    else
      throw new Error("Failed to create highlight, mounting point not found");
  }

  updatePosition(
    highlight: { from: Element | null; to: Element | null },
    move: Move
  ) {
    const fromHighlight = highlight.from as SVGCircleElement;
    const toHighlight = highlight.to as SVGCircleElement;
    const calc = (pos: number, isX = false) => {
      const position = parseInt(pos.toString());
      const result = isX ? -3.5 + position - 1 : 3.5 - position + 1;
      return result.toString();
    };
    fromHighlight.setAttributeNS(null, "cx", calc(move.from.x, true));
    fromHighlight.setAttributeNS(null, "cy", calc(move.from.y));
    toHighlight.setAttributeNS(null, "cx", calc(move.to.x, true));
    toHighlight.setAttributeNS(null, "cy", calc(move.to.y));
  }
}

new LichessExtension();
