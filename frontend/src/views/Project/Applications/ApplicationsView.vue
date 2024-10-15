<template>
    <div class="card bg-base-200 mb-4">
        <div class="card-body">
            <div class="card-title flex items-center justify-between">
                <RouterLink :to="{
                    name: 'projects.details',
                    params: { id: projectStore.applications.projectId }
                }">
                    {{ projectStore.applications.projectTitle }}
                </RouterLink>
                <RouterLink :to="{
                    name: 'projects.details',
                    params: { id: projectStore.applications.projectId }
                }">
                    <svgIconVue type="mdi" :path="mdiOpenInNew"></svgIconVue>
                </RouterLink>
            </div>
        </div>
    </div>

    <div class="space-y-2">
        <div v-for="position of projectStore.applications.positions" :key="position.PositionId"
            class="card bg-base-200">
            <div class="card-body">
                <div class="card-title flex items-center justify-between">
                    <h2>{{ position.title }} <span :class="{
                        ' badge-success': position.status === 'open',
                        'badge-error': position.status === 'filled'
                    }" class=" badge badge-outline">{{ positionStatusLabel(position.status)
                            }}</span></h2>
                    <span class="badge badge-info">{{ position.Applications.length }}</span>
                </div>
                <div class="space-y-3">
                    <p>{{ position.desc }}</p>
                    <div v-for="apply of position.Applications" :key="apply.id" class="space-y-2 p-3 border-b" :class="{
                        'border-b-accent': apply.status === 'pending',
                        'border-b-success': apply.status === 'accepted',
                        'border-b-error': apply.status === 'rejected'
                    }">
                        <!-- Başvuru Bilgileri, Mesaj ve Butonlar -->
                        <div class="flex flex-col space-y-2">
                            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                <div class="flex items-center space-x-2 mb-2 sm:mb-0">
                                    <div :class="{
                                        'badge-accent': apply.status === 'pending',
                                        'badge-success': apply.status === 'accepted',
                                        'badge-error': apply.status === 'rejected',
                                        'badge-neutral': apply.status === 'cancelled'
                                    }" class="badge">
                                        {{ getStatusLabel(apply.status) }}
                                    </div>
                                    <strong class="text-base">
                                        {{ apply.User.firstName }} {{ apply.User.lastName }}
                                    </strong>
                                </div>

                                <!-- Aksiyon Butonları (sadece büyük ekranlarda görünür) -->
                                <div class="hidden sm:flex space-x-2">
                                    <button @click="updateApplicationStatus(apply.id, 'accepted')"
                                        class="btn btn-sm btn-circle btn-success btn-outline" :class="{
                                            'btn-disabled': apply.status === 'accepted' || apply.status === 'rejected' || apply.status === 'cancelled'
                                        }">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                    <button @click="updateApplicationStatus(apply.id, 'rejected')"
                                        class="btn btn-sm btn-circle btn-error btn-outline" :class="{
                                            'btn-disabled': apply.status === 'accepted' || apply.status === 'rejected' || apply.status === 'cancelled'
                                        }">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Başvuru Mesajı -->
                            <div>
                                <p class="text-sm">{{ apply.message }}</p>
                            </div>

                            <!-- Aksiyon Butonları (sadece mobil görünümde, mesajın altında) -->
                            <div class="flex sm:hidden space-x-2 justify-end mt-2">
                                <button @click="updateApplicationStatus(apply.id, 'accepted')" class=" btn btn-sm
                                    btn-circle btn-success btn-outline" :class="{
                                        'btn-disabled': apply.status === 'accepted' || apply.status === 'rejected' || apply.status === 'cancelled'
                                    }">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M5 13l4 4L19 7" />
                                    </svg>
                                </button>
                                <button @click="updateApplicationStatus(apply.id, 'rejected')" class=" btn btn-sm
                                    btn-circle btn-error btn-outline" :class="{
                                        'btn-disabled': apply.status === 'accepted' || apply.status === 'rejected' || apply.status === 'cancelled'
                                    }">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import svgIconVue from '@jamescoyle/vue-icon'
import { mdiOpenInNew } from '@mdi/js'
import { useProjectStore } from '@/stores/project'
import apiClient from '@/services/axios'

const projectStore = useProjectStore()
const route = useRoute()

const positionStatusLabel = (status) => {
    switch (status) {
        case 'open':
            return "Açık"
        case 'filled':
            return "Dolu"
    }
}

// Durumun Türkçe çevirisi için bir fonksiyon
const getStatusLabel = (status) => {
    switch (status) {
        case 'pending':
            return 'Bekleniyor'
        case 'accepted':
            return 'Kabul Edildi'
        case 'rejected':
            return 'Reddedildi'
        case 'cancelled':
            return 'İptal Edildi'
        default:
            return 'Bilinmiyor'
    }
}

const updateApplicationStatus = async (applicationId, status) => {
    try {
        await apiClient.put(`/applications/${applicationId}`, { status });

        await projectStore.getApplications(route.params.id)
    } catch (error) {
        console.error("Başvuru durumu güncellenirken bir hata oluştu:", error);
    }
};


onMounted(() => {
    projectStore.getApplications(route.params.id)
})
</script>
