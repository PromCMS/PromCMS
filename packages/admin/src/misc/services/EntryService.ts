import { ApiResultItem, DatabaseTableName, ItemID } from '@prom-cms/shared'
import { apiClient } from '@api'
import { API_ENTRY_TYPES_URL } from '@constants'

export class EntryService {
  static getListUrl(entryId?: string) {
    return `${API_ENTRY_TYPES_URL}/${entryId?.toLowerCase()}`
  }

  static getCreateUrl(entryId: string) {
    return `${this.getListUrl(entryId)}/entries/create`
  }

  static getUrl(id: ItemID, entryId: string) {
    return `${this.getListUrl(entryId)}/entries/${id}`
  }

  static getDuplicateUrl(id: ItemID, entryId: string) {
    return `${this.getListUrl(entryId)}/entries/duplicate/${id}`
  }

  static apiGetUrl(id: ItemID, entryId: string) {
    return `${API_ENTRY_TYPES_URL}/${(
      entryId as string
    ).toLowerCase()}/items/${id}`
  }

  static apiGetListUrl(entryId: string) {
    return `${this.getListUrl((entryId as string).toLowerCase())}/items`
  }

  static apiGetListReorderUrl(entryId: string) {
    return `${this.apiGetListUrl(entryId)}/reorder`
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

    return apiClient.patch(this.apiGetUrl(info.id, info.model), {
      data: payload,
    })
  }

  static async delete(info: { id: ItemID; model: DatabaseTableName }) {
    try {
      const result = apiClient.delete(this.apiGetUrl(info.id, info.model))
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

  static async reorder(
    model: DatabaseTableName,
    payload: { fromId: ItemID; toId: ItemID }
  ) {
    return apiClient.patch(this.apiGetListReorderUrl(model), { data: payload })
  }
}
