import axios from 'axios'
import { userHasBeenLoggedOff } from '@events'

export const apiClient = axios.create({
  baseURL: '/api',
  timeout: 15000,
})

apiClient.interceptors.response.use(undefined, (error) => {
  if (
    window &&
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    error.response?.data?.code === 'not-logged-in'
  ) {
    window.dispatchEvent(userHasBeenLoggedOff)
  }

  return Promise.reject(error)
})
