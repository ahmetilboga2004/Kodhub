import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter()
    const accessToken = ref(localStorage.getItem('accessToken') || null)
    const authUser = ref(JSON.parse(localStorage.getItem('authUser')) || null)

    const isLoggedIn = computed(() => authUser.value !== null)

    const setAccessToken = (token) => {
        accessToken.value = token
        localStorage.setItem('accessToken', token)
    }

    const setAuthUser = (user) => {
        authUser.value = user
        localStorage.setItem('authUser', JSON.stringify(user))
    }

    const clearAuth = () => {
        accessToken.value = null
        authUser.value = null
        localStorage.removeItem('accessToken')
        localStorage.removeItem('authUser')
        router.push('/')
    }

    return { accessToken, authUser, isLoggedIn, setAccessToken, setAuthUser, clearAuth }
})
