<template>
    <div class="hero min-h-screen bg-base-200 rounded-lg">
        <div class="hero-content flex-col lg:flex-row-reverse">
            <div class="text-center lg:text-left">
                <h1 class="text-5xl font-bold">Kayıt Ol!</h1>
                <p class="py-6">
                    Yeteneklerini paylaşmaya ve yeni projelerde yer almaya hazır mısın? Kodhub’a katıl, hayallerini
                    gerçeğe dönüştür! Şimdi kaydol ve yaratıcı yolculuğuna başla!
                </p>
            </div>
            <div class="card w-full max-w-lg shrink-0">
                <form class="card-body" @submit.prevent="submitForm">
                    <!-- First Name -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Ad</span>
                        </label>
                        <input type="text" v-model="formData.firstName" placeholder="Ad" class="input input-bordered"
                            required />
                        <label class="label" v-if="errors.firstName">
                            <span class="label-text-alt text-error">{{ errors.firstName }}</span>
                        </label>
                    </div>
                    <!-- Last Name -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Soyad</span>
                        </label>
                        <input type="text" v-model="formData.lastName" placeholder="Soyad" class="input input-bordered"
                            required />
                        <label class="label" v-if="errors.lastName">
                            <span class="label-text-alt text-error">{{ errors.lastName }}</span>
                        </label>
                    </div>
                    <!-- Username -->
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
                    <!-- Password -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Şifre</span>
                        </label>
                        <input type="password" v-model="formData.password" placeholder="Şifre"
                            class="input input-bordered" required />
                        <label class="label" v-if="errors.password">
                            <span class="label-text-alt text-error">{{ errors.password }}</span>
                        </label>
                    </div>
                    <!-- Register Button -->
                    <div class="form-control mt-6">
                        <button type="submit" class="btn btn-primary">Kayıt ol</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import apiClient from '@/services/axios'

const toast = useToast()

const errors = ref({})
const formData = reactive({
    firstName: '',
    lastName: '',
    username: '',
    password: ''
})

const submitForm = async () => {
    try {
        const response = await apiClient.post('/auth/register', formData)
        toast.success(response.data.message)
        console.log(response)
        // Başarılı kayıt sonrası yapılacak işlemler (örn. login sayfasına yönlendirme)
    } catch (error) {
        if (error.response && error.response.data) {
            errors.value = error.response.data.errors || {}
            if (error.response.data.message) {
                toast.error(error.response.data.message)
            }
        } else {
            toast.error('Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.')
        }
        console.error(error)
    }
}
</script>
