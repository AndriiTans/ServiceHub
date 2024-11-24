import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProductService } from './product.service';
import { ProductCreateDto } from './dto/product-create.dto';
import { ProductResponseDto } from './dto/product-response.dto';

@Controller('shops/:shopId/products')
export class ShopProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(
    @Param('shopId') shopId: number,
    @Body() productCreateDto: ProductCreateDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productService.createProduct(shopId, productCreateDto);

    return plainToInstance(ProductResponseDto, product, { excludeExtraneousValues: true });
  }

  @Get()
  async getProductsByShopId(@Param('shopId') shopId: number): Promise<ProductResponseDto[]> {
    const products = await this.productService.getAllProductsByShopId(shopId);

    return plainToInstance(ProductResponseDto, products, { excludeExtraneousValues: true });
  }
}
