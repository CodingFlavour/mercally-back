import Price from "../prices/Price";
import ProductsBase from "./base";

enum SearchBy {
  cheapest = 'cheapest',
  bestRatio = 'bestRatio',
  expensive = 'expensive',
}

type OverchargedUnknown = unknown & { id_product: number }

type SearchParams = {
  searchProduct: string;
  stores: number[];
  min_price?: number;
  max_price?: number;
  min_price_per_unit?: number;
  max_price_per_unit?: number;
  is_white_brand?: boolean;
  id_brands?: number[];
  limit?: number;
  sort_by?: SearchBy;
}
type QueryResultItem = Products['fields'] & Price['fields']

class Products extends ProductsBase {
  constructor() {
    super();
  }

  async fillWithOriginalProduct(products: OverchargedUnknown[]) {
    const productsWithData = [];

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
    sort_by = SearchBy.cheapest
  }: SearchParams) {
    const queryMaxPrice = max_price > 0 ? `AND price <= ${max_price}` : '';
    const queryMaxPricePerUnit = max_price_per_unit > 0 ? `AND price_per_unit <= ${max_price_per_unit}` : '';
    const queryIsWhiteBrand = is_white_brand !== undefined ? `AND is_white_brand = ${is_white_brand == true}` : '';
    const queryIdBrand = id_brands ? `AND id_brand IN (${id_brands.join(',')})` : '';
    const orderBy = this.getOrderBy(sort_by)

    const [products] = await this.query<QueryResultItem[]>(`
      SELECT * 
      FROM ${this.table} 
      JOIN prices ON prices.id_product = products.id
      WHERE 
        name LIKE '%${searchProduct}%'
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

  private getOrderBy(sortBy: SearchBy) {
    switch (sortBy) {
      case SearchBy.cheapest:
        return 'ORDER BY price ASC'
      case SearchBy.bestRatio:
        return 'ORDER BY price_per_unit ASC'
      case SearchBy.expensive:
        return 'ORDER BY price DESC'
      default:
        return 'ORDER BY price ASC'
    }
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
}

export type { QueryResultItem, SearchBy }
export default Products
