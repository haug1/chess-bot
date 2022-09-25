import { StatusContainer } from "../common/status-container";

export class ChessComStatusContainer extends StatusContainer {
  mount(element: HTMLDivElement) {
    const container = document.querySelector(".play-controller-message");
    if (container) container.insertBefore(element, container.firstChild);
    else
      throw new Error(
        "Failed to create status container, mounting point not found"
      );
  }
}
