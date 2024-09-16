import Price from "../prices/Price";
import { SortBy } from "../prices/base";
import { Stores } from "../stores/Stores";
import ProductsBase, { Product } from "./base";

type SearchParams = {
  stores: number[];
  searchProduct?: string;
  min_price?: number;
  max_price?: number;
  min_price_per_unit?: number;
  max_price_per_unit?: number;
  is_white_brand?: boolean;
  id_brands?: number[];
  limit?: number;
  sort_by?: SortBy;
}
type QueryResultItem = Products['fields'] & Price['fields'] & Stores['fields']

type A<T> = T & { id_product: number }

class Products extends ProductsBase {
  constructor() {
    super();
  }

  async fillWithOriginalProduct<T>(products: A<T>[]) {
    const productsWithData: T[] & QueryResultItem[] = [];

    for (const product of products) {
      const originalProduct = await this.getByPk(product.id_product);

      productsWithData.push({
        ...product,
        ...originalProduct,
      })
    }

    return productsWithData;
  }

  async search({
    searchProduct,
    stores,
    min_price = 0,
    max_price = 0,
    min_price_per_unit = 0,
    max_price_per_unit = 0,
    is_white_brand,
    id_brands,
    limit = 10,
    sort_by = SortBy.cheapest
  }: SearchParams) {
    const queryMaxPrice = max_price > 0 ? `AND price <= ${max_price}` : '';
    const queryMaxPricePerUnit = max_price_per_unit > 0 ? `AND price_per_unit <= ${max_price_per_unit}` : '';
    const queryIsWhiteBrand = is_white_brand !== undefined ? `AND is_white_brand = ${is_white_brand == true}` : '';
    const queryIdBrand = id_brands ? `AND id_brand IN (${id_brands.join(',')})` : '';
    const orderBy = new Price().getOrderBy(sort_by)
    const searchProductName = searchProduct ? `product_name LIKE '%${searchProduct}%'` : '1=1';

    const [products] = await this.query<QueryResultItem[]>(`
      SELECT * 
      FROM ${this.table} 
      JOIN prices ON prices.id_product = products.id
      JOIN stores ON stores.id = prices.id_store
      WHERE 
        ${searchProductName}
        AND id_store IN (${stores.join(", ")})
        AND price >= ${min_price}
        ${queryMaxPrice}
        AND price_per_unit >= ${min_price_per_unit}
        ${queryMaxPricePerUnit}
        ${queryIsWhiteBrand}
        ${queryIdBrand}
      ${orderBy}
      LIMIT ${limit}
      `);

    return products;
  }



  async searchSuggestion(searchProduct: string) {
    const [products] = await this.query<QueryResultItem[]>(`
      SELECT * 
      FROM ${this.table} 
      JOIN prices ON prices.id_product = products.id
      WHERE name LIKE '%${searchProduct}%'
      ORDER BY price ASC
      LIMIT 10
    `);

    return products;
  }

  async autocomplete(searchProduct: string) {
    const [suggestedProduct] = await this.query<Product[] | undefined>(`
      SELECT product_name
      FROM ${this.table}
      WHERE product_name LIKE '%${searchProduct}%'
      LIMIT 1
    `);
      
    const suggestedProductName = suggestedProduct[0]?.product_name ?? '';

    return suggestedProductName;
  }
}

export type { QueryResultItem }
export default Products
