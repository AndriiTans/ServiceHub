import { Controller, Post, Body, Param, UseGuards, Req, Get } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { OrderService } from './order.service';
import { OrderCreateDto } from './dto/order-create.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';
import { CustomerService } from 'src/customers/customer.service';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly customerService: CustomerService,
  ) {}

  @Get()
  async getAllOrders(): Promise<OrderResponseDto[]> {
    const orders = await this.orderService.getAllOrders();

    return plainToInstance(OrderResponseDto, orders, { excludeExtraneousValues: true });
  }

  @Post()
  async createOrder(
    @Req() req: AuthenticatedRequest,
    @Body() orderCreateDto: OrderCreateDto,
  ): Promise<OrderResponseDto[]> {
    const user = req.user;

    const customer = await this.customerService.getCustomerByUserId(user._id);

    const orders = await this.orderService.createOrder(customer.id, orderCreateDto);

    return plainToInstance(OrderResponseDto, orders, { excludeExtraneousValues: true });
  }
}
