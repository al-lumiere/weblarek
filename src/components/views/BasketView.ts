import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { IBasketView } from "../../types";

export class BasketView extends Component<IBasketView> {
  protected itemsList: HTMLElement;
  protected itemsPrice: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.itemsList = ensureElement<HTMLElement>(
      ".basket__list",
      this.container
    );
    this.itemsPrice = ensureElement<HTMLElement>(
      ".basket__price",
      this.container
    );
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this.orderButton.addEventListener("click", () => {
      this.events.emit("orderButton:made");
    });
  }

  set basketContent(items: HTMLElement[] | string) {
    this.itemsList.replaceChildren(...items);
  }
  set basketPrice(value: number) {
    this.itemsPrice.textContent = `${String(value)} синапсов`;
  }
  set disabled(value: boolean | undefined) {
    if (value === undefined) return;
    this.orderButton.disabled = value;
  }
}
