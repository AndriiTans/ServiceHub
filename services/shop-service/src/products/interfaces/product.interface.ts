import { Shop } from 'src/shops/entities/shop.entity';
import { IShop } from 'src/shops/interfaces/shop.interface';
import { Comment } from '../entities/comment.entity';
import { Tag } from '../entities/tag.entity';
import { Category } from '../entities/category.entity';
import { Rating } from '../entities/rating.entity';

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  shop: IShop | Shop;
  category: Category;
  tags: Tag[];
  comments: Comment[];
  ratings: Rating[];
}
