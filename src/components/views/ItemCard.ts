import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { categoryMap } from "../../utils/constants";
import {
  ICardBase,
  ICatalogCard,
  IPreviewCard,
  IBasketCard,
  CategoryKey,
} from "../../types";

export class CardBase<T extends ICardBase = ICardBase> extends Component<T> {
  protected cardTitle: HTMLElement;
  protected cardPrice: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.cardTitle = ensureElement<HTMLElement>(".card__title", this.container);
    this.cardPrice = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(value: string) {
    this.cardTitle.textContent = value;
  }
  set price(value: number | null) {
    if (value === null) {
      this.cardPrice.textContent = `Бесценно`;
      return;
    }
    this.cardPrice.textContent = `${String(value)} синапсов`;
  }
}

export class CatalogCard extends CardBase<ICatalogCard> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );

    this.container.addEventListener("click", () => {
      this.events.emit("itemToPreview:open", { id: this.container.dataset.id });
    });
  }

  set image(value: string) {
    const alt = this.cardTitle?.textContent?.trim() ?? "";
    this.setImage(this.cardImage, value, alt);
  }
  set category(value: string) {
    this.cardCategory.textContent = value;
    for (const key in categoryMap) {
      this.cardCategory.classList.toggle(
        categoryMap[key as CategoryKey],
        key == value
      );
    }
  }
}

export class PreviewCard extends CardBase<IPreviewCard> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardText: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.cardCategory = ensureElement<HTMLElement>(
      ".card__category",
      this.container
    );
    this.cardImage = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container
    );
    this.cardText = ensureElement<HTMLElement>(".card__text", this.container);
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container
    );

    this.cardButton.addEventListener("click", (e) => {
      if (this.cardButton.disabled) return;
      e.stopPropagation();
      this.events.emit("itemToBuy:pushed", { id: this.container.dataset.id });
    });
  }

  set image(value: string) {
    const alt = this.cardTitle?.textContent?.trim() ?? "";
    this.setImage(this.cardImage, value, alt);
  }
  set category(value: string) {
    this.cardCategory.textContent = value;
    for (const key in categoryMap) {
      this.cardCategory.classList.toggle(
        categoryMap[key as CategoryKey],
        key == value
      );
    }
  }
  set text(value: string) {
    this.cardText.textContent = value;
  }
  set buttonText(value: string) {
    this.cardButton.textContent = value;
  }
  set disabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}

export class BasketCard extends CardBase<IBasketCard> {
  protected itemBasketIndex: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);
    this.itemBasketIndex = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container
    );

    this.deleteButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.events.emit("itemRemoveBasket:pushed", {
        id: this.container.dataset.id,
      });
    });
  }

  set index(value: string) {
    this.itemBasketIndex.textContent = value;
  }
}
