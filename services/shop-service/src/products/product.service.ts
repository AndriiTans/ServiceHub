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
import { Comment } from './entities/comment.entity';
import { TagCreateOrUpdateDto } from './dto/tag-create-or-update.dto';
import { ProductUpdateDto } from './dto/product-update.dto';
import { CommentCreateDto } from './dto/comment-create.dto';

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
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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

  async updateProduct(productId: number, updateProductInput: ProductUpdateDto) {
    const existingProduct = await this.productRepository.findOne({ where: { id: productId } });

    if (!existingProduct) {
      throw new BadRequestException(`Product with ID ${productId} doesn't exist.`);
    }

    const { tagIds, categoryId, ...otherUpdateProductInput } = updateProductInput;

    if (categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) {
        throw new BadRequestException(`Category with ID ${categoryId} doesn't exist.`);
      }
      existingProduct.category = category;
    }

    if (tagIds?.length > 0) {
      const tags = await Promise.all(
        tagIds.map(async (tagId) => {
          const existingTag = await this.tagRepository.findOne({ where: { id: tagId } });
          if (!existingTag) {
            throw new BadRequestException(`Tag with ID ${tagId} doesn't exist.`);
          }
          return existingTag;
        }),
      );

      existingProduct.tags = tags;
    }

    Object.assign(existingProduct, otherUpdateProductInput);

    return this.productRepository.save(existingProduct);
  }

  async getAllProductsByShopId(shopId: number): Promise<Product[]> {
    return this.productRepository.find({
      where: { shop: { id: shopId } },
      relations: ['category', 'tags', 'comment'],
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

  async removeProduct(productId: number): Promise<boolean> {
    const existingProduct = await this.productRepository.findOne({ where: { id: productId } });

    if (!existingProduct) {
      throw new BadRequestException(`Product with ID ${productId} doesn't exist.`);
    }

    await this.productRepository.remove(existingProduct);

    return true;
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

  async removeCategory(categoryId: number): Promise<boolean> {
    const existingCategory = await this.categoryRepository.findOne({ where: { id: categoryId } });

    if (!existingCategory) {
      throw new BadRequestException(`Category with ID ${categoryId} doesn't exist.`);
    }

    await this.categoryRepository.remove(existingCategory);

    return true;
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

  async removeTag(tagId: number): Promise<boolean> {
    const existingTag = await this.tagRepository.findOne({ where: { id: tagId } });

    if (!existingTag) {
      throw new BadRequestException(`Tag with ID ${tagId} doesn't exist.`);
    }

    await this.tagRepository.remove(existingTag);

    return true;
  }

  async getParentCommentsByProductId(productId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: {
        product: { id: productId },
        parentComment: null,
      },
      relations: ['author', 'replies', 'replies.author'],
    });
  }
  async createComment(authorId: number, productId: number, commentCreateDto: CommentCreateDto) {
    const { parentCommentId, ...otherCommentCreateDto } = commentCreateDto;

    const newComment = this.commentRepository.create({
      ...otherCommentCreateDto,
      author: { id: authorId },
      product: { id: productId },
      ...(parentCommentId ? { parentComment: { id: parentCommentId } } : {}),
    });

    return this.commentRepository.save(newComment);
  }

  async updateComment(commentId: number, commentUpdateDto: CommentCreateDto) {
    const existingComment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!existingComment) {
      throw new BadRequestException(`Comment with ID ${commentId} doesn't exist.`);
    }

    Object.assign(existingComment, commentUpdateDto);

    return this.commentRepository.save(existingComment);
  }

  async removeComment(commentId: number) {
    const existingComment = await this.commentRepository.findOne({ where: { id: commentId } });

    if (!existingComment) {
      throw new BadRequestException(`Comment with ID ${existingComment} doesn't exist.`);
    }

    await this.commentRepository.remove(existingComment);

    return true;
  }
}
