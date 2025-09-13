import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IModalWindow } from "../../types";

export class ModalWindow extends Component<IModalWindow> {
  protected modalContent: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("modalWindowButton:close");
    });
    this.container.addEventListener("click", (e) => {
      if (e.target === e.currentTarget) {
        this.events.emit("modalWindowButton:close");
      }
    });
  }

  set content(item: HTMLElement) {
    this.modalContent.replaceChildren(item);
  }
  set opened(value: boolean | undefined) {
    if (value == null) return;
    if (value) {
      this.container.classList.add("modal_active");
    } else {
      this.container.classList.remove("modal_active");
    }
  }
}
