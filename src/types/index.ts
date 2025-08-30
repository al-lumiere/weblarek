export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
    get<T extends object>(uri: string): Promise<T>;
    post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export type TPayment = "Онлайн" | "При получении" | null;

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