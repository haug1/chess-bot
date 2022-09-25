export abstract class StatusContainer {
  private static readonly ELEMENT_CONTAINER_ID = "status-container";
  private static readonly ELEMENT_TEXT_ID = "status-container--text";
  private static readonly ELEMENT_BUTTON_ID = "status-container--button";

  abstract mount(element: HTMLDivElement): void;

  private element = {
    container: document.querySelector<HTMLDivElement>(
      "#" + StatusContainer.ELEMENT_CONTAINER_ID
    ),
    text: document.querySelector<HTMLSpanElement>(
      "#" + StatusContainer.ELEMENT_TEXT_ID
    ),
    refreshButton: document.querySelector<HTMLButtonElement>(
      "#" + StatusContainer.ELEMENT_BUTTON_ID
    ),
  };

  public onRefreshButtonClicked: () => void;

  public update(msg: string, borderColor = "black", borderWidth = "2px") {
    if (!this.element.container) this.element = this.createElement();
    this.element.container!.style.borderColor = borderColor;
    this.element.container!.style.borderWidth = borderWidth;
    this.element.text!.innerText = msg;
  }

  private createElement() {
    const container = document.createElement("div");
    container.id = StatusContainer.ELEMENT_CONTAINER_ID;
    container.style.borderWidth = "2px";
    container.style.borderStyle = "solid";
    container.style.borderColor = "black";
    container.style.padding = "5px";
    const text = document.createElement("span");
    text.id = StatusContainer.ELEMENT_TEXT_ID;
    container.appendChild(text);
    const refreshButton = document.createElement("button");
    refreshButton.style.float = "right";
    refreshButton.innerText = "Refresh";
    refreshButton.addEventListener("click", this.onRefreshButtonClicked);
    container.appendChild(refreshButton);
    this.mount(container);
    return {
      container,
      text,
      refreshButton,
    };
  }
}
