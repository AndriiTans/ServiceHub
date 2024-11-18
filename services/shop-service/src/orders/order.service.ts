import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { Customer } from 'src/customers/entities/customer.entity';
import { CreateOrderDto } from './dto/order-create.dto';

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

  async createOrder(data: Partial<CreateOrderDto>): Promise<Order> {
    const customer = await this.customerRepository.findOne({ where: { id: data.customerId } });
    if (!customer) throw new Error('Customer not found');

    const items = await Promise.all(
      data.items.map(async (item) => {
        const product = await this.productRepository.findOne({ where: { id: item.productId } });
        if (!product) throw new Error('Product not found');

        return {
          product,
          quantity: item.quantity,
          price: product.price,
        };
      }),
    );

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = this.orderRepository.create({ customer, items, totalAmount });
    return this.orderRepository.save(order);
  }
}
