import ShoppingLists from "../../../../orm/ShoppingLists/ShoppingLists";
import { baseSortOptions } from "../../../../orm/base/BaseQuery";
import { executeEndpoint } from "../../../utils";

describe("Handle Shopping List Request Controller Test Suite", () => {
  it("should throw if no list id is provided", async () => {
    // Given
    // When
    const { data, res } = await executeEndpoint("deleteShoppingList?is_owner=1", 'DELETE');
    // Then
    expect(data.status).toBe(500);
    expect(res).toBeDefined();
    expect(res).toHaveProperty("error");
    expect(res.error).toBe("No params detected");
  });
  it("should throw if no owner provided", async () => {
    // Given
    // When
    const { data, res } = await executeEndpoint("deleteShoppingList?id_shopping_list=1", 'DELETE');
    // Then
    expect(data.status).toBe(500);
    expect(res).toBeDefined();
    expect(res).toHaveProperty("error");
    expect(res.error).toBe("No params detected");
  });
  it("should throw if no owner provided", async () => {
    // Given
    // When
    const { data, res } = await executeEndpoint("deleteShoppingList?id_shopping_list=1&is_owner=0", 'DELETE');
    // Then
    expect(data.status).toBe(403);
    expect(res).toBeDefined();
    expect(res).toHaveProperty("error");
    expect(res.error).toBe("User is no owner");
  });
  it("should delete a list with an accepted value", async () => {
    // Given
    await executeEndpoint("newShoppingList", "POST");
    const [ { id: lastShoppingListId } ] = await new ShoppingLists().getAll('id', baseSortOptions.DESC, 1)
    // When
    const { data, res } = await executeEndpoint(`deleteShoppingList?id_shopping_list=${lastShoppingListId}&is_owner=1`, 'DELETE');
    // Then
    expect(data.status).toBe(200);
    expect(res).toBeDefined();
    expect(res).toEqual({})
    const [ { id: newShoppingListId } ] = await new ShoppingLists().getAll('id', baseSortOptions.DESC, 1)
    expect(newShoppingListId).toBe(lastShoppingListId - 1)
  })
})