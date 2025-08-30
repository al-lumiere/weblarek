import { IItem } from "../../../types/index";

export class Basket {
  private selectedItems: IItem[] = [];

  constructor(items: IItem[] = []) {
    this.selectedItems = items.slice();
  }

  public getBItems(): IItem[] {
    return this.selectedItems.slice();
  }
  public addBItem(item: IItem): void {
    this.selectedItems.push(item);
  }
  public removeBItem(item: IItem): void {
    const index = this.selectedItems.findIndex(i => i.id === item.id);
    if (index !== -1) this.selectedItems.splice(index, 1);
  }
  public clearBasket(): void {
    this.selectedItems = [];
  }
  public getBTotalPrice(): number {
    return this.selectedItems.reduce((sum, i) => sum + (i.price ?? 0), 0);
  }
  public getBCount(): number {
    return this.selectedItems.length;
  }
  public basketHasItem(id: string): boolean {
    return this.selectedItems.some(i => i.id === id);
  }
}