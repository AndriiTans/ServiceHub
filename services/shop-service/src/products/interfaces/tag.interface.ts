import { Product } from 'src/products/entities/product.entity';

export class ITag {
  id: number;
  name: string;
  products: Product[];
}
