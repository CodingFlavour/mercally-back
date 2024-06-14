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
    const returnValue = value ? [ value ] : []
    return returnValue as unknown as ResultSetHeader & ShoppingList[];
  });

  const updateListCodeSpy = jest.spyOn(ShoppingLists.prototype, "updateListCode").mockImplementation(async () => undefined as any);

  const createNewListSpy = jest.spyOn(ShoppingLists.prototype, "createNewList")

  const deleteList = jest.spyOn(ShoppingLists.prototype, "deleteList")

  return { shoppingListSpy, updateListCodeSpy, createNewListSpy, deleteList };
}

function mockQuery() {
  const querySpy = jest.spyOn(ShoppingLists.prototype, "query").mockImplementation(async () => undefined as any);

  return { querySpy };
}

export { getOriginalShoppingListMock, mockShoppingList, mockQuery };
