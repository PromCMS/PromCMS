import { ApiFileInputData, ApiResultItem, ItemID } from '@prom-cms/shared'
import axios from 'axios'
import { apiClient } from '@api'
import { API_ENTRY_TYPES_URL } from '@constants'

export class FileService {
  static getListUrl(folder?: string) {
    return `/files${folder ? `?folder=${folder}` : ''}`
  }

  static getUrl(id: ItemID) {
    return `${this.getListUrl()}/entries/${id}`
  }

  static async create(file: File, info?: ApiFileInputData) {
    const formData = new FormData()
    formData.append('file', file)

    return apiClient.post(
      `${API_ENTRY_TYPES_URL}/files/items/create`,
      formData,
      {
        params: info || {},
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  }

  static async update(id: ItemID, payload: ApiResultItem) {
    //return EntryService.update({ model: 'users', id }, payload)
  }

  static async delete(id: ItemID) {
    return apiClient.delete(`${API_ENTRY_TYPES_URL}/files/items/${id}`)
  }
}
