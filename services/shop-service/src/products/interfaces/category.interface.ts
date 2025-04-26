import { Product } from 'src/products/entities/product.entity';

export class ICategory {
  id: number;
  name: string;
  products: Product[];
}
