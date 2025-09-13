import { categoryMap } from "../utils/constants";

export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods
  ): Promise<T>;
}

export type TPayment = "Онлайн" | "При получении" | null;
export type CategoryKey = keyof typeof categoryMap;

export interface IItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface ICustomer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type ApiProductsResponse = {
  total: number;
  items: IItem[];
};

export type OrderRequest = ICustomer & {
  items: string[];
};

export type OrderResponse = {
  orderId: string;
  total: number;
};

export interface IHeader {
  count: number;
}

export interface IGallery {
  catalogItems: HTMLElement[];
}

export interface IModalWindow {
  content: HTMLElement;
  opened: boolean;
}

export interface IBasketView {
  basketContent: HTMLElement[] | string;
  basketPrice: number;
  disabled: boolean;
}

export interface ISuccessedOrder {
  price: number;
}

export interface IFormBase {
  error?: string;
  disabled?: boolean;
}

export interface IOrderForm extends IFormBase {
  address?: string;
  payment?: TPayment;
}

export interface IContactForm extends IFormBase {
  email?: string;
  phone?: string;
}

export interface ICardBase {
  title: string;
  price: number | null;
}

export interface ICatalogCard extends ICardBase {
  image: string;
  category: string;
}

export interface IPreviewCard extends ICardBase {
  image: string;
  category: string;
  text: string;
  buttonText: string;
  disabled: boolean;
}

export interface IBasketCard extends ICardBase {
  index: string;
}
