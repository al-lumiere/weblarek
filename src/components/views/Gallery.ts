import { Component } from "../base/Component";
import { IGallery } from "../../types";

export class Gallery extends Component<IGallery> {
  protected catalog: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalog = container;
  }

  set catalogItems(items: HTMLElement[]) {
    this.catalog.replaceChildren(...items);
  }
}
