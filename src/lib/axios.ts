import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const api = axios.create({
  baseURL,
  withCredentials: true, // Critical for HttpOnly Cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Tự động mở gói data cho FE dễ dùng
    if (response.data && response.data.success) {
      return response.data // Trả về { message, data } thay vì cả AxiosResponse
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Tránh loop vô hạn cho api refresh chính nó
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/refresh')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await api.post('/auth/refresh', {})
        processQueue(null)
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Trường hợp 403 (Không có quyền) hoặc 401 lần 2
    if ((error.response?.status === 401 || error.response?.status === 403) && originalRequest.url?.includes('/auth/refresh')) {
        useAuthStore.getState().logout()
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
            window.location.href = '/login'
        }
    }

    return Promise.reject(error)
  }
)

export default api
