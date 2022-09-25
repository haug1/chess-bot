import { Highlights } from "../common/highlights";
import { Move } from "../common/types";

export class LichessHighlights extends Highlights {
  createHighlightElement(id: string, color: string): Element {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    element.id = id;
    element.setAttributeNS(null, "cx", "0");
    element.setAttributeNS(null, "cy", "0");
    element.setAttributeNS(null, "r", "0.4");
    element.setAttributeNS(null, "stroke-width", "0.1");
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
    const isBlack = document
      .querySelector("coords.files")!
      .classList.contains("black");
    const calc = (pos: number, isX = false) => {
      const position = parseInt(pos.toString());
      let result;
      if (isBlack) result = isX ? 3.5 - position + 1 : -3.5 + position - 1;
      else result = isX ? -3.5 + position - 1 : 3.5 - position + 1;
      return result.toString();
    };
    fromHighlight.setAttributeNS(null, "cx", calc(move.from.x, true));
    fromHighlight.setAttributeNS(null, "cy", calc(move.from.y));
    toHighlight.setAttributeNS(null, "cx", calc(move.to.x, true));
    toHighlight.setAttributeNS(null, "cy", calc(move.to.y));
  }

  protected override showAll() {
    (this.bestmove.from as HTMLElement).style.opacity = "1";
    (this.bestmove.to as HTMLElement).style.opacity = "1";
    (this.ponder.from as HTMLElement).style.opacity = "1";
    (this.ponder.to as HTMLElement).style.opacity = "1";
  }
}
