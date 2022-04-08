import axios from 'axios'
import { userHasBeenLoggedOff } from '@events'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

apiClient.interceptors.response.use(undefined, (error) => {
  if (window) {
    window.dispatchEvent(userHasBeenLoggedOff)
  }

  return Promise.reject(error)
})
