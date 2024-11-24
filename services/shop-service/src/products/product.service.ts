import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { Product } from './entities/product.entity';
import { Shop } from 'src/shops/entities/shop.entity';
import { ProductCreateDto } from './dto/product-create.dto';
import { Tag } from './entities/tag.entity';
import { CategoryCreateOrUpdateDto } from './dto/category-create-or-update.dto';
import { Category } from './entities/category.entity';
import { TagCreateOrUpdateDto } from './dto/tag-create-or-update.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Shop)
    private readonly shopRepository: Repository<Shop>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async createProduct(shopId: number, createProductInput: ProductCreateDto) {
    const existingShop = await this.shopRepository.findOne({ where: { id: shopId } });

    if (!existingShop) {
      throw new BadRequestException(`Shop with ID ${shopId} doesn't exist.`);
    }

    let tags = null;

    if (createProductInput.tagIds?.length > 0) {
      tags = await Promise.all(
        createProductInput.tagIds.map(async (tagId) => {
          const existingTag = await this.tagRepository.findOne({ where: { id: tagId } });
          if (!existingTag) {
            throw new BadRequestException(`Tag with ID ${tagId} doesn't exist.`);
          }
          return existingTag;
        }),
      );
    }

    const newProduct = this.productRepository.create({
      ...createProductInput,
      category: { id: createProductInput.categoryId },
      shop: { id: shopId },
      tags: tags,
    });

    return this.productRepository.save(newProduct);
  }

  async saveProduct(product: Product) {
    return this.productRepository.save(product);
  }

  async getAllProductsByShopId(shopId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { shop: { id: shopId } },
      relations: ['category', 'tags'],
    });
  }

  async getProductById(productId: number): Promise<Product> {
    return this.productRepository.findOne({
      where: { id: productId },
      relations: ['category', 'tag'],
    });
  }

  async updateProductImage(productId: number, newImageName: string): Promise<Product> {
    const product = await this.getProductById(productId);
    if (!product) {
      throw new BadRequestException(`Product with ID ${productId} not found.`);
    }

    if (product.imageName) {
      this.deleteOldImage(product.imageName);
    }

    product.imageName = newImageName;
    return this.productRepository.save(product);
  }

  private deleteOldImage(imageName: string): void {
    const oldImagePath = join('./uploads/products', imageName);
    if (existsSync(oldImagePath)) {
      try {
        unlinkSync(oldImagePath);
        console.log(`Old image removed: ${oldImagePath}`);
      } catch (error) {
        console.error(`Failed to remove old image: ${error.message}`);
        throw error;
      }
    }
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  async createCategory(categoryCreateDto: CategoryCreateOrUpdateDto) {
    const newCategory = this.categoryRepository.create({
      ...categoryCreateDto,
    });

    return this.categoryRepository.save(newCategory);
  }

  async getAllTags(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  async createTag(tagCreateDto: TagCreateOrUpdateDto) {
    const newTag = this.tagRepository.create({
      ...tagCreateDto,
    });

    return this.tagRepository.save(newTag);
  }
}
