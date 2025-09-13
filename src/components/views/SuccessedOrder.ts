import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { ISuccessedOrder } from "../../types";

export class SuccessedOrder extends Component<ISuccessedOrder> {
  protected closeButton: HTMLButtonElement;
  protected finalPrice: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container
    );
    this.finalPrice = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container
    );

    this.closeButton.addEventListener("click", () => {
      this.events.emit("toNewPurchasesButton:go");
    });
  }

  set price(value: number) {
    this.finalPrice.textContent = `Списано ${String(value)} синапсов`;
  }
}
