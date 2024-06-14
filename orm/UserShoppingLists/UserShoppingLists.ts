import { UserShoppingList, UserShoppingListRequest, UserShoppingListsBase } from "./UserShoppingListsBase";

class UserShoppingLists extends UserShoppingListsBase {
  constructor() {
    super();
  }

  async getActiveShoppingListId(userId: number) {
    const [ activeShoppingList ] = await this.query<UserShoppingList[]>(`SELECT id_shopping_list FROM ${this.table} WHERE id_user = ${userId} AND is_active = 1`);

    return activeShoppingList[ 0 ].id_shopping_list;
  }

  async getPendingRequests(activeShoppingList: number) {
    const [ requests ] = await this.query<UserShoppingList[]>(`SELECT * FROM ${this.table} WHERE id_shopping_list = ${activeShoppingList} and is_accepted = '${UserShoppingListRequest.PENDING}'`);

    return requests;
  }

  async updateIsAcceptedByShoppingListId(userId: number, idShoppingList: number, isAccepted: UserShoppingListRequest) {
    await this.query<UserShoppingList[]>(`UPDATE ${this.table} SET is_accepted = '${isAccepted}' WHERE id_user = ${userId} AND id_shopping_list = ${idShoppingList}`);
  }

  async deleteUserLinkToList(idShoppingList: number) {
    await this.query(`DELETE FROM ${this.table} WHERE id_shopping_list = ${idShoppingList}`)
  }

  async getIsOwner(userId: number, idShoppingList: number) {
    const [ isOwner ] = await this.query<UserShoppingList[]>(`SELECT is_owner FROM ${this.table} WHERE id_user = ${userId} AND id_shopping_list = ${idShoppingList}`)

    return isOwner[ 0 ].is_owner
  }
}

export { UserShoppingLists };