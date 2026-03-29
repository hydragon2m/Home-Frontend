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

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear auth store on 401/403
      useAuthStore.getState().logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
