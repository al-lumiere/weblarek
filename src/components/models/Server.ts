import type { IApi, IItem, ApiProductsResponse, OrderRequest, OrderResponse } from "../../types/index";

export class Server {
  constructor(private readonly api: IApi) {}

  async getProducts(): Promise<IItem[]> {
    const data = await this.api.get<ApiProductsResponse>("/api/weblarek/product/");
    return data.items;
  }
  async createOrder(payload: OrderRequest): Promise<OrderResponse> {
    return this.api.post<OrderResponse>("/api/weblarek/order/", payload, "POST");
  }
}