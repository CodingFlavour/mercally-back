import ShoppingLists from "../../../../orm/ShoppingLists/ShoppingLists";
import { baseSortOptions } from "../../../../orm/base/BaseQuery";
import { executeEndpoint } from "../../../utils"

describe("Handle Create New Shopping List Controller Test Suite", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  it("Should create new list", async () => {
    // Given
    const [ { id: lastShoppingListId } ] = await new ShoppingLists().getAll('id', baseSortOptions.DESC, 1)
    // When
    const { data, res } = await executeEndpoint("newShoppingList", "POST");
    // Then
    expect(data.status).toBe(200);
    expect(res).toBeDefined();
    expect(res).toEqual({})
    const [ { id: newShoppingListId } ] = await new ShoppingLists().getAll('id', baseSortOptions.DESC, 1)
    expect(newShoppingListId).toBe(lastShoppingListId + 1)
  })
})