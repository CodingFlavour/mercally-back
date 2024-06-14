import { handleDeleteShoppingList } from "../../../../controllers/shoppinglists/handleDeleteShoppingList";
import { handleShoppingListRequestController } from "../../../../controllers/shoppinglists/handleShoppingListRequestController";
import { mockExpress } from "../../../mocks/mock-express";
import { mockShoppingList } from "../../../mocks/orm/mock-shopping-list";

describe("Handle Delete Shopping List Controller Test Suite", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });
  it("should throw error if no request is provided", async () => {
    // Given
    const { Request, Response } = mockExpress();
    // When
    await handleDeleteShoppingList(Request, Response);
    // Then
    expect(Response.json.mock.calls[ 0 ][ 0 ]).toHaveProperty("error");
    expect(Response.status).toHaveBeenCalledWith(400);
    expect(Response.json.mock.calls[ 0 ][ 0 ].error).toBe("Missing query")
  });
  it("should throw if no id shopping list is provided", async () => {
    // Given
    const { Request, Response } = mockExpress({
      query: {
        is_owner: "1"
      }
    });
    // When
    await handleDeleteShoppingList(Request, Response);
    // Then
    expect(Response.json.mock.calls[ 0 ][ 0 ]).toHaveProperty("error");
    expect(Response.status).toHaveBeenCalledWith(500);
    expect(Response.json.mock.calls[ 0 ][ 0 ].error).toBe("No params detected")
  });
  it("should throw if no is owner is provided", async () => {
    // Given
    const { Request, Response } = mockExpress({
      query: {
        id_shopping_list: "1"
      }
    });
    // When
    await handleDeleteShoppingList(Request, Response);
    // Then
    expect(Response.json.mock.calls[ 0 ][ 0 ]).toHaveProperty("error");
    expect(Response.status).toHaveBeenCalledWith(500);
    expect(Response.json.mock.calls[ 0 ][ 0 ].error).toBe("No params detected")
  });
  it("should throw if no is owner", async () => {
    // Given
    const { Request, Response } = mockExpress({
      query: {
        id_shopping_list: "1",
        is_owner: "0"
      }
    });
    // When
    await handleDeleteShoppingList(Request, Response);
    // Then
    expect(Response.json.mock.calls[ 0 ][ 0 ]).toHaveProperty("error");
    expect(Response.status).toHaveBeenCalledWith(403);
    expect(Response.json.mock.calls[ 0 ][ 0 ].error).toBe("User is no owner")
  });
  it("should delete shopping list request with an accepted value", async () => {
    // Given
    const expectedIdShoppingList = "1";
    const { Request, Response } = mockExpress({
      query: {
        id_shopping_list: expectedIdShoppingList,
        is_owner: "1"
      }
    });
    const { deleteList } = mockShoppingList()
    // When
    await handleDeleteShoppingList(Request, Response);
    // Then
    expect(Response.json).toHaveBeenCalledWith({});
    expect(deleteList).toHaveBeenCalledTimes(1);
  });
});