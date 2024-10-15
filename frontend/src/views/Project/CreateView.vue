<template>
    <div class="max-w-3xl mx-auto">
        <div class="card bg-base-200">
            <div class="card-body">
                <h1 class="card-title text-2xl">Yeni Proje oluştur</h1>
                <form @submit.prevent="submitForm">
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Proje Başlığı</span>
                        </label>
                        <input
                            type="text"
                            v-model="formData.title"
                            placeholder="Başlık"
                            class="input input-bordered"
                            required
                        />
                        <label class="label" v-if="errors.title">
                            <span class="label-text-alt text-error">{{ errors.title }}</span>
                        </label>
                    </div>

                    <!-- Açıklama -->
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Açıklama</span>
                        </label>
                        <textarea
                            v-model="formData.desc"
                            placeholder="Açıklama"
                            class="textarea"
                            required
                        ></textarea>
                        <label class="label" v-if="errors.desc">
                            <span class="label-text-alt text-error">{{ errors.desc }}</span>
                        </label>
                    </div>

                    <div class="mt-8">
                        <h3 class="text-lg mb-2 font-semibold">Pozisyonlar</h3>
                        <div
                            v-for="(position, index) in formData.positions"
                            :key="index"
                            class="form-control mb-5"
                        >
                            <input
                                type="text"
                                v-model="position.title"
                                placeholder="Pozisyon Başlığı"
                                class="input input-bordered mb-2"
                                required
                            />
                            <input
                                type="text"
                                v-model="position.desc"
                                placeholder="Pozisyon Açıklaması"
                                class="input input-bordered mb-2"
                                required
                            />
                            <div class="label">
                                <span class="label-text"></span>
                                <span class="label-text-alt"
                                    ><button
                                        type="button"
                                        @click="removePosition(index)"
                                        class="btn btn-error btn-sm"
                                    >
                                        Sil
                                    </button></span
                                >
                            </div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 justify-between">
                        <button
                            type="button"
                            @click="addPosition"
                            class="btn btn-secondary btn-sm md:btn-md xl:btn-wide"
                        >
                            Pozisyon Ekle
                        </button>
                        <button type="submit" class="btn btn-primary btn-sm md:btn-md xl:btn-wide">
                            Oluştur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import apiClient from '@/services/axios'
import { ref, reactive } from 'vue'
import { useToast } from 'vue-toastification'
const toast = useToast()

const formData = reactive({
    title: '',
    desc: '',
    positions: [{ title: '', desc: '' }] // Pozisyonlar listesi
})
const errors = ref({})

// Pozisyon ekleme fonksiyonu
const addPosition = () => {
    formData.positions.push({ title: '', desc: '' })
}

// Pozisyon silme fonksiyonu
const removePosition = (index) => {
    formData.positions.splice(index, 1)
}

const submitForm = async () => {
    try {
        const response = await apiClient.post('/projects', formData)
        toast.success(response.data.message)
    } catch (error) {
        toast.warning(error.response.data.message)
        console.error(error)
    }
}
</script>
