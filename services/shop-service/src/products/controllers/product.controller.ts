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
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { plainToInstance } from 'class-transformer';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AuthenticatedRequest } from 'src/common/types/authenticated-request.interface';
import { CustomerService } from 'src/customers/customer.service';
import { ProductService } from '../product.service';
import { ProductResponseDto } from '../dto/product-response.dto';
import { CategoryCreateOrUpdateDto } from '../dto/category-create-or-update.dto';
import { CategoryResponseDto } from '../dto/category-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { TagCreateOrUpdateDto } from '../dto/tag-create-or-update.dto';
import { TagResponseDto } from '../dto/tag-response.dto';
import { ProductUpdateDto } from '../dto/product-update.dto';
import { CommentResponseDto } from '../dto/comment-response.dto';
import { CommentCreateDto } from '../dto/comment-create.dto';
import { CommentUpdateDto } from '../dto/comment-update.dto';
import { RatingResponseDto } from '../dto/rating-response.dto';
import { RatingCreateOrUpdateDto } from '../dto/rating-create-or-update.dto';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly customerService: CustomerService,
  ) {}

  @Put(':productId')
  async updateProduct(
    @Param('productId') productId: number,
    @Body() productUpdateInputDto: ProductUpdateDto,
  ): Promise<ProductResponseDto> {
    const updatedProduct = await this.productService.updateProduct(
      productId,
      productUpdateInputDto,
    );

    return plainToInstance(ProductResponseDto, updatedProduct, { excludeExtraneousValues: true });
  }

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

  @Delete(':productId')
  async removeProductById(@Param('productId') productId: number): Promise<boolean> {
    return await this.productService.removeProduct(productId);
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

  @Delete('category/:categoryId')
  async removeCategoryById(@Param('categoryId') categoryId: number): Promise<boolean> {
    return await this.productService.removeCategory(categoryId);
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

  @Delete('tag/:tagId')
  async removeTagById(@Param('tagId') tagId: number): Promise<boolean> {
    return await this.productService.removeTag(tagId);
  }

  @Get(':productId/comments')
  async getAllCommentsByProductId(
    @Param('productId') productId: number,
  ): Promise<CommentResponseDto[]> {
    const comments = await this.productService.getParentCommentsByProductId(productId);

    return plainToInstance(CommentResponseDto, comments, { excludeExtraneousValues: true });
  }

  @Post(':productId/comments')
  async createComment(
    @Req() req: AuthenticatedRequest,
    @Param('productId') productId: number,
    @Body() commentCreateDto: CommentCreateDto,
  ): Promise<CommentResponseDto> {
    const user = req.user;

    const customer = await this.customerService.getCustomerByUserId(user._id);

    const comment = await this.productService.createComment(
      customer.id,
      productId,
      commentCreateDto,
    );

    return plainToInstance(CommentResponseDto, comment, { excludeExtraneousValues: true });
  }

  @Put('comments/:commentId')
  async updateComment(
    @Param('commentId') commentId: number,
    @Body() commentUpdateDto: CommentUpdateDto,
  ): Promise<CommentResponseDto> {
    const comment = await this.productService.updateComment(commentId, commentUpdateDto);

    return plainToInstance(CommentResponseDto, comment, { excludeExtraneousValues: true });
  }

  @Delete('comments/:commentId')
  async removeCommentById(@Param('commentId') commentId: number): Promise<boolean> {
    return await this.productService.removeComment(commentId);
  }

  @Get(':productId/ratings')
  async getAllRatingsByProductId(
    @Param('productId') productId: number,
  ): Promise<RatingResponseDto[]> {
    const ratings = await this.productService.getRatingsByProductId(productId);

    return plainToInstance(RatingResponseDto, ratings, { excludeExtraneousValues: true });
  }

  @Post(':productId/ratings')
  async createRating(
    @Req() req: AuthenticatedRequest,
    @Param('productId') productId: number,
    @Body() ratingCreateDto: RatingCreateOrUpdateDto,
  ): Promise<RatingResponseDto> {
    const user = req.user;

    const customer = await this.customerService.getCustomerByUserId(user._id);

    const rating = await this.productService.createRating(customer.id, productId, ratingCreateDto);

    return plainToInstance(RatingResponseDto, rating, { excludeExtraneousValues: true });
  }

  @Put('ratings/:ratingId')
  async updateRating(
    @Param('ratingId') ratingId: number,
    @Body() ratingUpdateDto: RatingCreateOrUpdateDto,
  ): Promise<RatingResponseDto> {
    const rating = await this.productService.updateRating(ratingId, ratingUpdateDto);

    return plainToInstance(RatingResponseDto, rating, { excludeExtraneousValues: true });
  }

  @Delete('ratings/:ratingId')
  async removeRatingById(@Param('ratingId') ratingId: number): Promise<boolean> {
    return await this.productService.removeRating(ratingId);
  }
}
