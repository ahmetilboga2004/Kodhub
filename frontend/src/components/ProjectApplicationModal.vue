<template>
    <dialog ref="modalRef" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <div v-if="authStore.isLoggedIn">
                <h3 class="text-lg font-bold">Pozisyon Seç ve Başvur!</h3>
                <p class="py-4">Bu projeye başvurmak istediğiniz pozisyonu seçin:</p>
                <div v-if="project?.Positions?.length > 0">
                    <div>
                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Pozisyon Seç</span>
                            </div>
                            <select v-model="selectedPositionId" class="select select-bordered">
                                <option disabled selected>Seç</option>
                                <option v-for="position in project.Positions" :disabled="position.status === 'filled'"
                                    :key="position.id" :value="position.id">
                                    {{ position.title }}
                                </option>
                            </select>
                        </label>
                    </div>
                    <div class="mt-2">
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
            </div>
            <div v-else>
                <h2 class=" text-lg font-bold">Projeye başvuru yapmak için önce giriş yapın
                </h2>
            </div>
            <div class="modal-action">
                <button class="btn" @click="closeModal">Vazgeç</button>
                <button v-if="authStore.isLoggedIn" class="btn btn-primary" :disabled="!selectedPositionId"
                    @click="handleApply">
                    Başvur
                </button>
                <RouterLink type="button" to="/login" v-else class="btn btn-primary">
                    Giriş Yap
                </RouterLink>
            </div>

        </div>
    </dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import apiClient from '@/services/axios'
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore()
const toast = useToast()
const modalRef = ref(null)
const selectedPositionId = ref(null)
const message = ref('Bu proje için uygun olduğumu düşünüyorum')

// Props tanımlama
const props = defineProps({
    project: {
        type: Object,
        required: false,
        default: null
    }
})

// Events tanımlama
const emit = defineEmits(['close'])

// Modal metodları
const showModal = () => {
    selectedPositionId.value = null
    message.value = 'Bu proje için uygun olduğumu düşünüyorum'
    modalRef.value.showModal()
}

const closeModal = () => {
    modalRef.value.close()
    emit('close')
}

// Başvuru yapma fonksiyonu
const handleApply = async () => {
    if (!props.project) {
        toast.error('Proje bilgisi bulunamadı')
        return
    }

    try {
        const payload = {
            message: message.value,
            positionId: selectedPositionId.value,
            projectId: props.project.id
        }
        const flattenedPayload = JSON.parse(JSON.stringify(payload))
        const response = await apiClient.post('/applications/', flattenedPayload)
        toast.success(response.data.message)
        closeModal()
    } catch (error) {
        console.error(error)
        toast.warning(error.response.data.message)
    }
    closeModal()
}

// Dışa aktarılan metodlar
defineExpose({
    showModal
})
</script>