import express, { Express } from "express";
import { productsEndpoints } from "../endpoints/scraper/products-endpoints";
import { shoppingListEndpoints } from "../endpoints/scraper/shopping-list-endpoints";
<<<<<<< HEAD
import { HISTORY_PRICES, PRICES, PRODUCTS, SHOPPING_LIST, SHOPPING_LIST_PRODUCTS, USER_SHOPPING_LIST } from "../scripts/dummies";
import init from "../scripts/init-seed";
=======
import {
  HISTORY_PRICES,
  PRICES,
  PRODUCTS,
  SHOPPING_LIST,
  SHOPPING_LIST_PRODUCTS,
  STORES,
  USER_SHOPPING_LIST,
  USERS_STORES,
  USER_PREFERENCES,
  USER
} from "../scripts/dummies";
import init, { createTableBaseTest } from "../scripts/init-seed";
import { storesEndpoints } from "../endpoints/scraper/stores-endpoints";
import { userEndpoints } from "../endpoints/scraper/user-endpoints";
>>>>>>> main

async function buildTestDB() {
  await init(PRODUCTS,
    PRICES,
    HISTORY_PRICES,
    SHOPPING_LIST,
    SHOPPING_LIST_PRODUCTS,
    USER_SHOPPING_LIST,
    USERS_STORES,
    STORES,
    USER_PREFERENCES,
    USER
  )

  return {
    products: PRODUCTS,
    prices: PRICES,
    historyPrices: HISTORY_PRICES,
    shoppingList: SHOPPING_LIST,
    shoppingListProducts: SHOPPING_LIST_PRODUCTS,
    userShoppingList: USER_SHOPPING_LIST,
    usersStores: USERS_STORES,
    stores: STORES,
    userPreferences: USER_PREFERENCES,
    user: USER
  }
}

async function buildTestDBWithBaseTest() {
  await buildTestDB()

  await createTableBaseTest()
}
function injectEndpoints(app: Express) {
  app.use(express.json());
  productsEndpoints(app);
  shoppingListEndpoints(app);
  storesEndpoints(app);
  userEndpoints(app)
}

async function executeEndpoint(endpoint: string, method: string = 'GET', body: any = {}) {
  const randomPort = Math.floor(Math.random() * 1000) + 8000
  const app = express()
  injectEndpoints(app)
  const server = app.listen(randomPort, () => console.log(`Server running on port ${randomPort}`))

  const options = method === 'GET' ? {} : { body: JSON.stringify(body), headers: { 'Content-Type': 'application/json' } }

  const requestOptions = {
    method,
    ...options,
  }

  const data = await fetch(`http://localhost:${randomPort}/${endpoint}`, requestOptions)
  const res = await data.json()

  server.close()

  return { data, res }
}

export { buildTestDB, buildTestDBWithBaseTest, executeEndpoint };

