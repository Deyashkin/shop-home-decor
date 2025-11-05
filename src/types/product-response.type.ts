import { ProductType } from './product.type';

export interface ProductResponseType {
  totalCount: number;
  pages: number;
  items: ProductType[];
}
