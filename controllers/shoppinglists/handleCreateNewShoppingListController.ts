import { Request, Response } from 'express';
import { UserShoppingLists } from '../../orm/UserShoppingLists/UserShoppingLists';
import ShoppingLists from '../../orm/ShoppingLists/ShoppingLists';
import { UserShoppingListRequest } from '../../orm/UserShoppingLists/UserShoppingListsBase';

async function handleCreateNewShoppingListController(req: Request, res: Response) {
  // Aqui comprobamos que el usuario esté autenticado y recogemos su ID
  const fakeUserId = 1

  const newIdShoppingList = await new ShoppingLists().createNewList()

  await new UserShoppingLists().insert({ id_user: fakeUserId, is_owner: 1, id_shopping_list: newIdShoppingList, is_accepted: UserShoppingListRequest.ACCEPTED, is_active: 0 })

  return res.status(200).json({})
}

export { handleCreateNewShoppingListController };