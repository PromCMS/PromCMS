import { ApiResultItem, ItemID } from '@prom-cms/shared'
import { EntryService } from '.'

export class UserService {
  static getListUrl() {
    return '/users'
  }
  static getCreateUrl() {
    return `${this.getListUrl()}/create`
  }
  static getUrl(id: ItemID) {
    return `${this.getListUrl()}/${id}`
  }

  static async create(payload: ApiResultItem) {
    return EntryService.create({ model: 'users' }, payload)
  }

  static async update(id: ItemID, payload: ApiResultItem) {
    return EntryService.update({ model: 'users', id }, payload)
  }

  static async delete(id: ItemID) {
    return EntryService.delete({ model: 'users', id })
  }
}
