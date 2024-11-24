import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Category } from './entities/category.entity';
import { Product } from './entities/product.entity';
import { Comment } from './entities/comment.entity';
import { Rating } from './entities/rating.entity';
import { Tag } from './entities/tag.entity';
import { ShopModule } from 'src/shops/shop.module';
import { SharedModule } from 'src/shared/shared.module';
import { ShopProductController } from './shop-product.controller';
import { ProductController } from './product.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category, Comment, Rating, Tag]),
    ShopModule,
    SharedModule,
  ],
  controllers: [ShopProductController, ProductController],
  providers: [ProductService],
  exports: [TypeOrmModule, ProductService],
})
export class ProductModule {}
