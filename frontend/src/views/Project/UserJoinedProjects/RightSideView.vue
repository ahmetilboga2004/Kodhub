<template>
    <div v-if="projectStore.isLoading" class="card bg-base-200 sticky top-4">
        <div class="card-body">
            <span class="loading loading-spinner loading-lg"></span>
        </div>
    </div>
    <div v-else-if="projectStore.userJoinedProjects" class="card bg-base-200 sticky top-4">
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
                        {{ projectStore.userJoinedProjects.firstName }}
                        {{ projectStore.userJoinedProjects.lastName }}
                    </h2>
                    <p class="text-sm text-base-content/70">@{{ projectStore.userJoinedProjects.username }}</p>
                </div>
            </div>
            <p v-if="projectStore.userJoinedProjects.title" class="mb-4">
                {{ projectStore.userJoinedProjects.title }}
            </p>
            <div class="flex lg:flex-col xl:flex-row justify-center items-center gap-2">
                <RouterLink
                    :to="{ name: 'user.profile', params: { username: projectStore.userJoinedProjects.username } }"
                    class="btn btn-outline btn-sm">Profil</RouterLink>
            </div>
            <div class="divider">Proje Bilgileri</div>
            <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                    <span>Katılma Tarihi:</span>
                    <span v-if="isValidDate(new Date(projectStore.userJoinedProjects.createdAt))">
                        {{ format(new Date(projectStore.userJoinedProjects.createdAt), 'dd/MM/yyyy HH:mm') }}
                    </span>
                    <span v-else>
                        Geçersiz tarih
                    </span>
                </div>
                <div v-if="projectStore.userJoinedProjects.id === authStore.authUser.id" class="flex justify-between">
                    <span>Toplam Proje:</span>
                    <span>{{ projectStore.userJoinedProjects.projects.length || 0 }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useProjectStore } from '@/stores/project'
import { format } from 'date-fns';

const authStore = useAuthStore()
const projectStore = useProjectStore()
const isValidDate = (date) => !isNaN(date.getTime());

</script>
