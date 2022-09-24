export abstract class StatusContainer {
  private static readonly ELEMENT_ID = "status-container";

  abstract mount(element: HTMLDivElement): void;

  private element = document.querySelector<HTMLDivElement>(
    "#" + StatusContainer.ELEMENT_ID
  );

  get exists() {
    return !!this.element;
  }

  public update(msg: string, borderColor = "black", borderWidth = "2px") {
    if (!this.element) this.element = this.createElement();
    this.element.style.borderColor = borderColor;
    this.element.style.borderWidth = borderWidth;
    this.element.innerText = msg;
  }

  private createElement() {
    const element = document.createElement("div");
    element.id = StatusContainer.ELEMENT_ID;
    element.style.borderWidth = "2px";
    element.style.borderStyle = "solid";
    element.style.borderColor = "black";
    element.style.padding = "5px";

    this.mount(element);

    return element;
  }
}
