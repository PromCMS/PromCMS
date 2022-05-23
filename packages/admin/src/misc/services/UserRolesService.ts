import { API_ENTRY_TYPES_URL } from '@constants'
import { ApiResultItem, ItemID } from '@prom-cms/shared'
import { EntryService } from '.'

export class UserRolesService {
  static getListUrl() {
    return '/settings/user-roles'
  }

  static getCreateUrl() {
    return `${this.getListUrl()}/create`
  }

  static apiGetInfoUrl() {
    return `${API_ENTRY_TYPES_URL}/user-roles`
  }

  static apiGetUrl(id: ItemID) {
    return `${this.apiGetInfoUrl()}/items/${id}`
  }

  static apiGetListUrl(id: ItemID) {
    return `${this.apiGetInfoUrl()}/items`
  }

  static async create(payload: ApiResultItem) {
    return EntryService.create({ model: 'user-roles' }, payload)
  }

  static async update(id: ItemID, payload: ApiResultItem) {
    return EntryService.update({ model: 'user-roles', id }, payload)
  }

  static async delete(id: ItemID) {
    return EntryService.delete({ model: 'user-roles', id })
  }
}
