<template>
    <div class="hero min-h-screen bg-base-200 rounded-lg">
        <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="text-center lg:text-left">
                <h1 class="text-5xl font-bold">Giriş Yap!</h1>
                <p class="py-6">
                    Hoş geldin tekrar! Giriş yaparak projelerine devam et ve yeni fırsatları keşfet. Kodhub'da seni
                    bekleyen heyecan verici projeler var!
                </p>
            </div>
            <div class="card w-full max-w-lg shrink-0">
                <form class="card-body" @submit.prevent="submitForm">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Kullanıcı Adı</span>
                        </label>
                        <input type="text" v-model="formData.username" placeholder="Kullanıcı adı"
                            class="input input-bordered" required />
                        <label class="label" v-if="errors.username">
                            <span class="label-text-alt text-error">{{ errors.username }}</span>
                        </label>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Şifre</span>
                            <span class="label-text-alt">Şifreni mi unuttun?</span>
                        </label>
                        <input type="password" v-model="formData.password" placeholder="password"
                            class="input input-bordered" required />
                        <label class="label" v-if="errors.password">
                            <span class="label-text-alt text-error">{{ errors.password }}</span>
                        </label>
                    </div>
                    <div class="form-control mt-6">
                        <button type="submit" class="btn btn-primary">Giriş yap</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import apiClient from '@/services/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const errors = ref({})
const formData = reactive({
    username: '',
    password: ''
})

const submitForm = async () => {
    try {
        const response = await apiClient.post('/auth/login', formData)
        console.log(response.data)
        authStore.setAuthUser(response.data.data.user)
        toast.success(response.data.message)
        router.push('/')
    } catch (error) {
        if (error.response && error.response.data) {
            errors.value = error.response.data.errors || {}
            if (error.response.data.message) {
                toast.error(error.response.data.message)
            }
        } else {
            toast.error('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.')
        }
    }
}
</script>
