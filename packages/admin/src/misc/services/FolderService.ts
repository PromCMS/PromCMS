import { ApiResultItem, ItemID } from '@prom-cms/shared'
import { apiClient } from '@api'
import { API_ENTRY_TYPES_URL } from '@constants'

export class FolderService {
  static apiGetListUrl(path: string) {
    return `${API_ENTRY_TYPES_URL}/folders?path=${path}`
  }

  static async create(path: string) {
    return apiClient.post(`${API_ENTRY_TYPES_URL}/folders`, {
      data: {
        path: path.replaceAll(' ', '_'),
      },
    })
  }

  static async update(id: ItemID, payload: ApiResultItem) {
    //return EntryService.update({ model: 'users', id }, payload)
  }

  static async delete(path: string) {
    await apiClient.delete(`${API_ENTRY_TYPES_URL}/folders`, {
      params: {
        path,
      },
    })

    return
  }
}
