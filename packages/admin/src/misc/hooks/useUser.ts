import { ItemID, User } from '@prom-cms/shared'
import { useModelItem } from '.'

export const useUser = (itemId: ItemID | undefined) =>
  useModelItem<User>('users', itemId)
