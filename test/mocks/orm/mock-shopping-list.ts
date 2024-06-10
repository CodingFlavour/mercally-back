import { ResultSetHeader } from "mysql2";
import ShoppingLists from "../../../orm/ShoppingLists/ShoppingLists";
import { ShoppingList } from "../../../orm/ShoppingLists/ShoppingListsBase";

function getOriginalShoppingListMock(id: number): ShoppingList {
  return {
    id,
    code: `shopping-list-${id}`,
  }
}

function mockShoppingList(value?: ShoppingList) {
  const shoppingListSpy = jest.spyOn(ShoppingLists.prototype, "getAllByField").mockImplementation(async () => {
    const returnValue = value ? [value] : []
    return returnValue as unknown as ResultSetHeader & ShoppingList[];
  });

  const updateListCodeSpy = jest.spyOn(ShoppingLists.prototype, "updateListCode")

  return { shoppingListSpy, updateListCodeSpy };
}

function mockQuery() {
  const querySpy = jest.spyOn(ShoppingLists.prototype, "query")

  return { querySpy };
}

export { getOriginalShoppingListMock, mockShoppingList, mockQuery };
