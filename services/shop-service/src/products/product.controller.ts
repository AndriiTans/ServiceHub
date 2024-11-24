import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Get,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { plainToInstance } from 'class-transformer';
import { ProductService } from './product.service';
import { ProductResponseDto } from './dto/product-response.dto';
import { CategoryCreateOrUpdateDto } from './dto/category-create-or-update.dto';
import { CategoryResponseDto } from './dto/category-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TagCreateOrUpdateDto } from './dto/tag-create-or-update.dto';
import { TagResponseDto } from './dto/tag-response.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Put(':productId/image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/products',
        filename: (req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const ext = extname(file.originalname);
          cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new BadRequestException('Only image files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadProductImage(
    @Param('productId') productId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ProductResponseDto> {
    if (!file) {
      throw new BadRequestException('File upload failed.');
    }

    const updatedProduct = await this.productService.updateProductImage(productId, file.filename);

    return plainToInstance(ProductResponseDto, updatedProduct, { excludeExtraneousValues: true });
  }

  @Get('category')
  async getAllCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.productService.getAllCategories();

    return plainToInstance(ProductResponseDto, categories, { excludeExtraneousValues: true });
  }

  @Post('category')
  async createCategory(
    @Body() categoryCreateDto: CategoryCreateOrUpdateDto,
  ): Promise<CategoryResponseDto> {
    const category = await this.productService.createCategory(categoryCreateDto);

    return plainToInstance(ProductResponseDto, category, { excludeExtraneousValues: true });
  }

  @Get('tag')
  async getAllTags(): Promise<TagResponseDto[]> {
    const tags = await this.productService.getAllTags();

    return plainToInstance(TagResponseDto, tags, { excludeExtraneousValues: true });
  }

  @Post('tag')
  async createTag(@Body() tagCreateDto: TagCreateOrUpdateDto): Promise<TagResponseDto> {
    const tag = await this.productService.createTag(tagCreateDto);

    return plainToInstance(TagResponseDto, tag, { excludeExtraneousValues: true });
  }
}
