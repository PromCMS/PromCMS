import { ItemID, User } from '@prom-cms/shared'
import { PublicConfiguration, BareFetcher } from 'swr/dist/types'
import { useModelItem } from '.'

export const useUser = (
  itemId: ItemID | undefined,
  config?: Partial<PublicConfiguration<User, any, BareFetcher<User>>>
) => useModelItem<User>('users', itemId, config)
