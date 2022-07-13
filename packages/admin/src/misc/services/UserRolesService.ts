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
    return `${API_ENTRY_TYPES_URL}/userroles`
  }

  static apiGetUrl(id: ItemID) {
    return `${this.apiGetInfoUrl()}/items/${id}`
  }

  static apiGetListUrl(id: ItemID) {
    return `${this.apiGetInfoUrl()}/items`
  }

  static async create(payload: ApiResultItem) {
    return EntryService.create({ model: 'userroles' }, payload)
  }

  static async update(id: ItemID, payload: ApiResultItem) {
    return EntryService.update({ model: 'userroles', id }, payload)
  }

  static async delete(id: ItemID) {
    return EntryService.delete({ model: 'userroles', id })
  }
}
