<template>
    <div class="max-w-3xl mx-auto">
        <div class="card bg-base-200" v-if="projectStore.project">
            <div class="card-body">
                <h2 class="card-title">Projeni Düzenle</h2>
                <form @submit.prevent="updateProject">
                    <div class="space-y-4">
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Proje Başlığı</span>
                            </div>
                            <input v-model="projectStore.project.title" type="text"
                                class="input input-bordered w-full" />
                        </label>
                        <label class="form-control">
                            <div class="label">
                                <span class="label-text">Proje Açıklaması</span>
                            </div>
                            <textarea v-model="projectStore.project.desc" class="textarea textarea-bordered h-64"
                                placeholder="Proje açıklaması"></textarea>
                        </label>
                    </div>

                    <!-- Pozisyonlar bölümü -->
                    <div class="mt-4 mb-6">
                        <h3 class="text-lg font-semibold mb-2">Pozisyonlar</h3>
                        <ul class="space-y-2">
                            <li v-for="(position, index) in projectStore.project.Positions"
                                :key="position.id || `new-${index}`" class="form-control gap-2">
                                <input v-model="position.title" class="input input-bordered"
                                    placeholder="Pozisyon başlığı" />
                                <input v-model="position.desc" class="input input-bordered"
                                    placeholder="Pozisyon açıklaması" />
                                <div class="label">
                                    <span class="label-text"></span>
                                    <span class="label-text-alt"><button type="button" @click="removePosition(index)"
                                            class="btn btn-error btn-sm">
                                            Sil
                                        </button></span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="card-actions flex items-center justify-between">
                        <button @click="addPosition" type="button" class="btn btn-secondary btn-sm md:btn-md ">
                            Yeni Pozisyon Ekle
                        </button>
                        <button type="submit" class="btn btn-primary btn-sm md:btn-md">
                            Güncelle
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <!-- Yükleniyor mesajı -->
        <div v-else class="text-center">
            <p>Yükleniyor...</p>
        </div>
    </div>
</template>

<script setup>
import apiClient from '@/services/axios'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()
const toast = useToast()
const route = useRoute()

const updateProject = async () => {
    try {
        const response = await apiClient.put(`/projects/${projectStore.project.id}`, {
            title: projectStore.project.title,
            desc: projectStore.project.desc,
            positions: projectStore.project.Positions.map((position) => ({
                id: position.id, // Eğer varsa ID'yi gönder
                title: position.title,
                desc: position.desc
            }))
        })
        toast.success(response.data.message)
    } catch (error) {
        toast.error(error.response?.data?.message || 'Bir hata oluştu')
        console.error(error)
    }
}

const addPosition = () => {
    projectStore.project.Positions.push({ title: '', desc: '' })
}
const removePosition = (index) => {
    projectStore.project.Positions.splice(index, 1)
}
onMounted(() => {
    projectStore.getProjectDetails(route.params.id)
})
</script>
