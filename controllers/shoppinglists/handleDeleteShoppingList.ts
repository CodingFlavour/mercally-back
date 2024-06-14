import { Request, Response } from 'express';
import { UserShoppingLists } from '../../orm/UserShoppingLists/UserShoppingLists';
import ShoppingLists from '../../orm/ShoppingLists/ShoppingLists';

async function handleDeleteShoppingList(req: Request, res: Response) {
  // Aqui comprobamos que el usuario esté autenticado y recogemos su ID
  const fakeUserId = 1

  if (!req.query) return res.status(400).json({ error: 'Missing query' })

  const { id_shopping_list, is_owner } = req.query;

  if (!id_shopping_list || !is_owner) {
    return res.status(500).json({ error: "No params detected" });
  }

  const idShoppingList = Array.isArray(id_shopping_list) ? id_shopping_list[ 0 ] : id_shopping_list;
  const isOwner = Number(Array.isArray(is_owner) ? is_owner[ 0 ] : is_owner);

  // Checking and verifying user is owner
  const isOwnerCheck = await new UserShoppingLists().getIsOwner(fakeUserId, Number(idShoppingList))

  if (!isOwner || !isOwnerCheck || (isOwner !== isOwnerCheck)) {
    return res.status(403).json({ error: 'User is no owner' })
  }

  // Delete all list link to users
  await new UserShoppingLists().deleteUserLinkToList(Number(idShoppingList))
  // Delete list
  await new ShoppingLists().deleteList(Number(idShoppingList))

  return res.status(200).json({})
}


export { handleDeleteShoppingList };