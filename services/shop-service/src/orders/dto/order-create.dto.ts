export interface CreateOrderDto {
  customerId: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
