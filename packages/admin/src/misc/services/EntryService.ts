import { ApiResultItem, DatabaseTableName, ItemID } from '@prom-cms/shared'
import { apiClient } from '@api'
import { API_ENTRY_TYPES_URL } from '@constants'

export class EntryService {
  static getListUrl(entryId: string) {
    return `${API_ENTRY_TYPES_URL}/${(entryId as string).toLowerCase()}`
  }

  static getCreateUrl(entryId: string) {
    return `${this.getListUrl(entryId)}/entries/create`
  }

  static getUrl(id: ItemID, entryId: string) {
    return `${this.getListUrl(entryId)}/entries/${id}`
  }

  static apiGetUrl(id: ItemID, entryId: string) {
    return `${API_ENTRY_TYPES_URL}/${(
      entryId as string
    ).toLowerCase()}/items/${id}`
  }

  static apiGetListUrl(entryId: string) {
    return `${this.getListUrl((entryId as string).toLowerCase())}/items`
  }

  static apiGetCreateUrl(entryId: string) {
    return `${this.getListUrl(
      (entryId as string).toLowerCase()
    )}/entries/create`
  }

  static async update(
    info: {
      id: ItemID
      model: DatabaseTableName
    },
    payload: ApiResultItem
  ) {
    if (!Object.keys(payload).length) return

    try {
      const result = apiClient.patch(
        `${API_ENTRY_TYPES_URL}/${info.model}/items/${info.id}`,
        { data: payload }
      )
      return result
    } catch (e) {
      // TODO: Toast this message
      console.error(`An error happened during a item update call`, e)
    }
  }

  static async delete(info: { id: ItemID; model: DatabaseTableName }) {
    try {
      const result = apiClient.delete(
        `${API_ENTRY_TYPES_URL}/${info.model}/items/${info.id}`
      )
      return result
    } catch (e) {
      // TODO: Toast this message
      console.error(`An error happened during a item remove call`, e)
    }
  }

  static async create(
    info: { model: DatabaseTableName },
    payload: ApiResultItem
  ) {
    try {
      const result = apiClient.post(
        `${API_ENTRY_TYPES_URL}/${info.model}/items/create`,
        { data: payload }
      )
      return result
    } catch (e) {
      // TODO: Toast this message
      console.error(`An error happened during a item create call`, e)
    }
  }
}
