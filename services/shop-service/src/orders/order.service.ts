import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { In, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderCreateDto, OrderItemCreateInputDto } from './dto/order-create.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async getAllOrders(): Promise<Order[]> {
    const orders = await this.orderRepository.find({ relations: ['customer', 'items', 'shop'] });

    return orders;
  }

  async createOrder(customerId: number, data: OrderCreateDto): Promise<Order[]> {
    const productIds = data.items.map(({ productId }) => productId);

    const products = await this.productRepository.find({
      where: { id: In(productIds) },
      relations: ['shop'],
    });

    const productsByShopId: Map<number, OrderItemCreateInputDto[]> = products.reduce(
      (acc: Map<number, OrderItemCreateInputDto[]>, product: Product) => {
        if (!acc.has(product.shop.id)) {
          acc.set(product.shop.id, []);
        }
        acc.get(product.shop.id).push({
          productId: product.id,
          quantity: data.items.find(({ productId }) => productId === product.id)?.quantity || 1,
          price: product.price,
        });
        return acc;
      },
      new Map<number, OrderItemCreateInputDto[]>(),
    );

    for (const [shopId, items] of productsByShopId.entries()) {
      console.log(`Shop ID: ${typeof shopId} ${shopId}`);
      items.forEach((item) => {
        console.log(
          `  Product ID: ${item.productId}, Quantity: ${item.quantity}, Price: ${item.price}`,
        );
      });
    }

    const orders = await Promise.all(
      Array.from(productsByShopId.entries()).map(async ([shopId, items]) => {
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const orderItems = items.map((item) => ({
          product: { id: item.productId },
          quantity: item.quantity,
          price: item.price,
        }));

        const order = this.orderRepository.create({
          customer: { id: customerId },
          shop: { id: shopId },
          items: orderItems, // Cascade saves these
          totalAmount,
        });

        return this.orderRepository.save(order);
      }),
    );

    return orders;
  }
}
