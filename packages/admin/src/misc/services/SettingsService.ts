import { ApiResultItem, DatabaseTableName, ItemID } from '@prom-cms/shared'
import { apiClient } from '@api'
import { API_ENTRY_TYPES_URL } from '@constants'

export class SettingsService {
  static getListUrl() {
    return `${API_ENTRY_TYPES_URL}/settings`
  }

  static getCreateUrl() {
    return `${this.getListUrl()}/entries/create`
  }

  static getUrl(id: ItemID) {
    return `${this.getListUrl()}/entries/${id}`
  }

  static apiGetUrl(id: ItemID) {
    return `${API_ENTRY_TYPES_URL}/settings/items/${id}`
  }

  static apiGetListUrl() {
    return `${this.getListUrl()}/items`
  }

  static apiGetCreateUrl() {
    return `${this.getListUrl()}/entries/create`
  }

  static async update(id: ItemID, payload: ApiResultItem) {
    if (!Object.keys(payload).length) return

    const result = apiClient.patch(
      `${API_ENTRY_TYPES_URL}/settings/items/${id}`,
      { data: payload }
    )
    return result
  }

  static async delete(id: ItemID) {
    const result = apiClient.delete(
      `${API_ENTRY_TYPES_URL}/settings/items/${id}`
    )
    return result
  }

  static async create(payload: ApiResultItem) {
    const result = apiClient.post(
      `${API_ENTRY_TYPES_URL}/settings/items/create`,
      { data: payload }
    )

    return result
  }
}
