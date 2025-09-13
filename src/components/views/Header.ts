import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IHeader } from "../../types";

export class Header extends Component<IHeader> {
  protected basket: HTMLButtonElement;
  protected basketCounter: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.basket = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container
    );
    this.basketCounter = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container
    );

    this.basket.addEventListener("click", () => {
      this.events.emit("basketButton:open");
    });
  }

  set count(value: number) {
    this.basketCounter.textContent = String(value);
  }
}
