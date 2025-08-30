import { IItem } from "../../../types/index";

export class Products {
  private allItems: IItem[];
  private currentItem: IItem | null;


  constructor(items: IItem[] = [], currentItem: IItem | null = null) {
    this.allItems = items;
    this.currentItem = currentItem;
  }

  public setItems(items: IItem[]): void {
    this.allItems = items.slice();
  }
  public getItems(): IItem[] {
    return this.allItems.slice();
  }
  public getItemById(id: string): IItem | undefined {
    return this.allItems.find((i) => i.id === id);
  }
  public setCurrentItem(item: IItem): void {
    this.currentItem = item;
  }
  public getCurrentItem(): IItem | null {
    return this.currentItem;
  }
}