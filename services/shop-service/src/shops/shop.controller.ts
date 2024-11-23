import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
  Put,
  Delete,
  Param,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AdminOrOwnershipGuard } from 'src/common/guards/admin-or-ownership.guard';
import { CustomerService } from 'src/customers/customer.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ShopService } from './shop.service';
import { ShopResponseDto } from './dto/shop-response.dto';
import { ShopCreateDto } from './dto/shop-create.dto';
import { ShopCreateInputDto } from './dto/shop-create-input.dto';
import { ShopUpdateDto } from './dto/shop-update.dto';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';

@Controller('shops')
@UseGuards(AuthGuard)
export class ShopController {
  constructor(
    private readonly shopService: ShopService,
    private readonly customerService: CustomerService,
  ) {}

  @Get()
  async getAllShops(): Promise<ShopResponseDto[]> {
    try {
      const shops = await this.shopService.getAllShops();

      return plainToInstance(ShopResponseDto, shops, { excludeExtraneousValues: true });
    } catch (error) {
      console.error('Error fetching shops:', error.message);
      throw error;
    }
  }

  @Get()
  async getShopByUserId(@Req() req: AuthenticatedRequest): Promise<ShopResponseDto> {
    try {
      const user = req.user;

      const shop = await this.shopService.getShopByUserId(user.id);

      return plainToInstance(ShopResponseDto, shop, { excludeExtraneousValues: true });
    } catch (error) {
      console.error('Error fetching shops:', error.message);
      throw error;
    }
  }

  @Post()
  async createShop(
    @Req() req: AuthenticatedRequest,
    @Body() createShopDto: ShopCreateDto,
  ): Promise<ShopResponseDto> {
    try {
      const user = req.user;

      const owner = await this.customerService.getCustomerByUserId(user.id);

      const shopCreateInput: ShopCreateInputDto = {
        ...createShopDto,
        owner,
      };

      const shop = await this.shopService.createShop(owner.id, shopCreateInput);

      return plainToInstance(ShopResponseDto, shop, { excludeExtraneousValues: true });
    } catch (error) {
      console.error('Error creating shop:', error.message);

      if (error.status === HttpStatus.BAD_REQUEST) {
        throw error;
      }

      throw new HttpException('Failed to create shop.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  async updateShop(
    @Req() req: AuthenticatedRequest,
    @Body() shopUpdateInput: ShopUpdateDto,
  ): Promise<ShopResponseDto> {
    try {
      const user = req.user;

      const shop = await this.shopService.updateShop(user.id, shopUpdateInput);

      return plainToInstance(ShopResponseDto, shop, { excludeExtraneousValues: true });
    } catch (error) {
      console.error('Error creating shop:', error.message);

      if (error.status === HttpStatus.BAD_REQUEST) {
        throw error;
      }

      throw new HttpException('Failed to create shop.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @UseGuards(AdminOrOwnershipGuard)
  async deleteCustomer(@Param('id') id: number): Promise<boolean> {
    try {
      return await this.shopService.deleteShopById(id);
    } catch (error) {
      throw new HttpException('Failed to delete the shop.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
