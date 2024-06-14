import { handleCreateNewShoppingListController } from "../../../../controllers/shoppinglists/handleCreateNewShoppingListController";
import { handleShoppingListRequestController } from "../../../../controllers/shoppinglists/handleShoppingListRequestController";
import { mockExpress } from "../../../mocks/mock-express";
import { mockShoppingList } from "../../../mocks/orm/mock-shopping-list";
import { executeEndpoint } from "../../../utils";

describe("Handle Create New Shopping List Controller Test Suite", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  it("should update the shopping list request with a rejected value", async () => {
    // Given
    const { Request, Response } = mockExpress({});
    const { createNewListSpy } = mockShoppingList()
    // When
    await handleCreateNewShoppingListController(Request, Response);
    // Then
    expect(Response.json).toHaveBeenCalledWith({});
    expect(createNewListSpy).toHaveBeenCalledTimes(1);
  });
})


