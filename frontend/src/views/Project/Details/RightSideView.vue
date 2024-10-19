<template>
    <div v-if="projectStore.isLoading" class="card bg-base-200 sticky top-4">
        <div class="card-body">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    </div>
    <div v-else-if="projectStore.project" class="card bg-base-200 sticky top-4">
        <div class="card-body">
            <div class="flex items-center gap-4 mb-4">
                <div class="avatar">
                    <div class="w-16 rounded-full">
                        <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                            alt="User Avatar" />
                    </div>
                </div>
                <div>
                    <h2 class="card-title font-bold capitalize">
                        {{ projectStore.project.User.firstName }}
                        {{ projectStore.project.User.lastName }}
                    </h2>
                    <p class="text-sm text-base-content/70">@{{ projectStore.project.User.username }}</p>
                </div>
            </div>
            <p v-if="projectStore.project.User.title" class="mb-4">
                {{ projectStore.project.User.title }}
            </p>
            <div class="flex lg:flex-col xl:flex-row justify-center items-center gap-2">
                <button v-if="
                    authStore.isLoggedIn &&
                    authStore.authUser.id !== projectStore.project.User.id
                " class="btn btn-primary btn-sm" @click="openModal">
                    Projeye Başvur
                </button>
                <RouterLink :to="{ name: 'user.profile', params: { username: projectStore.project.User.username } }"
                    class="btn btn-outline btn-sm">Profil</RouterLink>
            </div>
            <div class="divider">Proje Bilgileri</div>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span>Oluşturulma Tarihi:</span>
                    <span>{{ format(projectStore.project.createdAt, "dd/MM/yyyy HH:mm") }}</span>
                </div>
                <div v-if="authStore.authUser && projectStore.project.UserId === authStore.authUser.id"
                    class="flex justify-between">
                    <span>Toplam Başvuru:</span>
                    <span>{{ projectStore.project.totalApplications || 0 }}</span>
                </div>
                <div class="flex justify-between">
                    <span>Durum:</span>
                    <span :class="{
                        'badge-info': projectStore.project.status === 'open',
                        'badge-warning': projectStore.project.status === 'partial filled',
                        'badge-error': projectStore.project.status === 'filled',
                        'badge-success': projectStore.project.status === 'completed',
                        'badge-accent': projectStore.project.status === 'in progress',
                        'badge-neutral': projectStore.project.status === 'suspended'
                    }" class="badge">{{ projectStatusLabel(projectStore.project.status) }}</span>
                </div>
            </div>
        </div>
    </div>
    <!-- Modal -->
    <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Pozisyon Seç ve Başvur!</h3>
            <p class="py-4">Bu projeye başvurmak istediğiniz pozisyonu seçin:</p>
            <div v-if="projectStore.project && projectStore.project.Positions.length > 0">
                <div>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text">Pozisyon Seç</span>
                        </div>
                        <select v-model="selectedPositionId" class="select select-bordered">
                            <option disabled selected>Seç</option>
                            <option v-for="position in projectStore.project.Positions"
                                :disabled="position.status === 'filled'" :key="position.id" :value="position.id">
                                {{ position.title }}
                            </option>
                        </select>
                    </label>
                </div>
                <div class=" mt-2">
                    <div class="label">
                        <span class="label-text">Mesaj</span>
                    </div>
                    <input v-model="message" type="text" placeholder="Bir Başvuru mesajı yazın"
                        class="input input-bordered w-full" />
                </div>
            </div>
            <div v-else>
                <p>Bu projede pozisyon bulunmamaktadır.</p>
            </div>
            <div class="modal-action">
                <button class="btn" @click="closeModal">Vazgeç</button>
                <button class="btn btn-primary" :disabled="!selectedPositionId" @click="applyToProject">
                    Başvur
                </button>
            </div>
        </div>
    </dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import apiClient from '@/services/axios';
import { useToast } from 'vue-toastification';
import { format } from 'date-fns';

const toast = useToast()
const authStore = useAuthStore()
const projectStore = useProjectStore()
const selectedPositionId = ref(null)
const modalRef = ref(null)
const message = ref("Bu proje için uygun olduğumu düşünüyorum")

// Modal açma fonksiyonu
const openModal = () => {
    selectedPositionId.value = null
    modalRef.value.showModal()
}

// Modal kapama fonksiyonu
const closeModal = () => {
    modalRef.value.close()
}

// Başvuru yapma fonksiyonu
const applyToProject = async () => {
    try {
        const payload = {
            message: message.value,
            positionId: selectedPositionId.value,
            projectId: projectStore.project.id
        }

        const flattenedPayload = JSON.parse(JSON.stringify(payload))
        const response = await apiClient.post('/applications/', flattenedPayload)
        console.log(response)
        toast.success(response.data.message)
    } catch (error) {
        console.error(error)
        toast.warning(error.response.data.message)
    }

    closeModal()
}

const projectStatusLabel = (status) => {
    switch (status) {
        case "partial filled":
            return "Kısmen Dolu"
        case "filled":
            return "Dolu"
        case "in progress":
            return "Çalışılıyor"
        case "complated":
            return "Tamamlandı"
        case "suspended":
            return "Askıya Alındı"
        default:
            return "Açık";
    }
}


</script>
