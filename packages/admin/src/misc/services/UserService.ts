import { apiClient } from '@api'
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

  static apiGetBlockUrl(id: ItemID) {
    return `${EntryService.apiGetUrl(id, 'users')}/block`
  }

  static apiGetUnblockUrl(id: ItemID) {
    return `${EntryService.apiGetUrl(id, 'users')}/unblock`
  }

  static apiGetRequestPasswordResetUrl(id: ItemID) {
    return `${EntryService.apiGetUrl(id, 'users')}/request-password-reset`
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

  static async block(userId: ItemID) {
    return apiClient.patch(this.apiGetBlockUrl(userId))
  }

  static async unblock(userId: ItemID) {
    return apiClient.patch(this.apiGetUnblockUrl(userId))
  }

  static async requestPasswordReset(userId: ItemID) {
    return apiClient.patch(this.apiGetRequestPasswordResetUrl(userId))
  }

  static toggleBlock(userId: ItemID, isBlocked: boolean) {
    return isBlocked ? this.unblock(userId) : this.block(userId)
  }
}
