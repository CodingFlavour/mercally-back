
import ShoppingListsBase from './ShoppingListsBase';

class ShoppingLists extends ShoppingListsBase {
  constructor() {
    super();
  }

  async createNewList() {
    const [ { insertId } ] = await this.query(`INSERT INTO ${this.table} VALUES()`)

    return insertId
  }

  async updateListCode(shoppingListId: number, listCode: string) {
    await this.query(`UPDATE ${this.table} SET code = '${listCode}' WHERE id = ${shoppingListId}`);
  }

  async deleteList(shoppingListId: number) {
    await this.query(`DELETE FROM ${this.table} WHERE id = ${shoppingListId}`)
  }
}

export default ShoppingLists;
