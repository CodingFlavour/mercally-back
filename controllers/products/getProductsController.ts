import { Request, Response } from "express";
import Products from "../../orm/products/Products";

async function getProductsController(req: Request, res: Response, _next: Function) {
  const products = await new Products().getAll();

  return res.send(products);
}

export { getProductsController };

