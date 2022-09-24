import { StatusContainer } from "../common/status-container";

export class LichessStatusContainer extends StatusContainer {
  mount(element: HTMLDivElement): void {
    const container = document.querySelector(".round__app.variant-standard");
    if (container) container?.appendChild(element);
    else
      throw new Error(
        "Failed to create status container, mounting point not found"
      );
  }
}
