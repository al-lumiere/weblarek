import type { IApi, IItem, ApiProductsResponse, OrderRequest, OrderResponse } from "../../types/index";

export class Server {
  constructor(private readonly api: IApi) {}

  async getProducts(): Promise<IItem[]> {
    const data = await this.api.get<ApiProductsResponse>("/product/");
    return data.items;
  }
  async createOrder(payload: OrderRequest): Promise<OrderResponse> {
    return this.api.post<OrderResponse>("/order/", payload, "POST");
  }
}