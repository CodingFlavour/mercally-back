import { Request, Response } from "express";
import Products from "../../orm/products/Products";

async function searchController(req: Request, res: Response) {
  if (!req.query) return res.status(400).json({ error: 'Missing query' })

  const searchParam = req.query.search;
  // En principio liberemos esto para que se puedan hacer busquedas sin query, solo cuando no hay absolutamente nada
  // const storesParam = req.query.stores;
  // if (!searchParam) {
  //   return res.status(500).json({ error: "No product detected" });
  // } 

  const searchProduct = Array.isArray(searchParam) ? searchParam[0] : searchParam;
  /* Aqui tendriamos que comprobar lo siguiente:
  * 1. Si no hay usuario, ignoramos `stores` y pillamos los por defecto
  * 2. Si hay usuario, comparar `stores` con los que tiene el usuario, los uqe no tenga, ignorarlos
  */
  const fakeStores = [1, 2, 4];

  if (searchProduct && typeof searchProduct !== "string") {
    return res.status(500).json({ error: "Invalid search" });
  }

  if (searchProduct && searchProduct.length < 3) {
    return res.status(500).json({ error: "Search term too short" });
  }

  const products = await new Products().search({
    ...req.query,
    stores: fakeStores,
    searchProduct
  });

  res.json(products);
}

export { searchController };
