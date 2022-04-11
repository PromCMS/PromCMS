import { ApiResultItem, ItemID } from '@prom-cms/shared'
import axios from 'axios'
import { apiClient } from '@api'
import { API_ENTRY_TYPES_URL } from '@constants'
import { FileService } from '.'

export class FolderService {
  static apiGetListUrl(path: string) {
    return `${FileService.getListUrl}/folders?path=${path}`
  }

  static async create(path: string) {
    return apiClient.post(`${API_ENTRY_TYPES_URL}/files/folders`, {
      data: {
        path: path.replaceAll(' ', '_'),
      },
    })
  }

  static async update(id: ItemID, payload: ApiResultItem) {
    //return EntryService.update({ model: 'users', id }, payload)
  }

  static async delete(path: string) {
    await apiClient.delete(`${API_ENTRY_TYPES_URL}/files/folders`, {
      params: {
        path,
      },
    })

    return
  }
}