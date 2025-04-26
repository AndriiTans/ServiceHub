import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderController } from './order.controller';
import { Product } from 'src/products/entities/product.entity';
import { ProductModule } from 'src/products/product.module';
import { CustomerModule } from 'src/customers/customer.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), CustomerModule, ProductModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
