import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const apiClient = axios.create({
    baseURL: 'http://localhost:4000/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
})

apiClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore()
        const token = authStore.accessToken
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => {
        const newToken = response.headers['x-new-token']
        if (newToken) {
            const authStore = useAuthStore()
            authStore.setAccessToken(newToken)
        }
        return response
    },
    (error) => {
        const authStore = useAuthStore()

        // Eğer token geçersiz veya expire olduysa ve yeni token üretilemiyorsa
        // (yani refresh token yoksa veya geçersizse)
        if (error.response?.status === 401 && !error.response.headers['x-new-token']) {
            // Oturumu temizle
            authStore.clearAuth()
        }
        return Promise.reject(error)
    }
)

export default apiClient
