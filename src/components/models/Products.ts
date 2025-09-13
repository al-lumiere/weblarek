import { IItem } from "../../types/index";
import { IEvents } from "../base/Events";

export class Products {
  private allItems: IItem[];
  private currentItem: IItem | null;

  constructor(
    protected events: IEvents,
    items: IItem[] = [],
    currentItem: IItem | null = null
  ) {
    this.allItems = items;
    this.currentItem = currentItem;
  }

  public setItems(items: IItem[]): void {
    this.allItems = items.slice();
    this.events.emit("productsData:changed");
  }
  public getItems(): IItem[] {
    return this.allItems.slice();
  }
  public getItemById(id: string): IItem | undefined {
    return this.allItems.find((i) => i.id === id);
  }
  public setCurrentItem(item: IItem): void {
    this.currentItem = item;
    this.events.emit("productPreview:changed");
  }
  public getCurrentItem(): IItem | null {
    return this.currentItem;
  }
}
