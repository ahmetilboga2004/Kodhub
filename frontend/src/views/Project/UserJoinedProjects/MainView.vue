<template>
    <div v-if="projectStore.isLoading" class="flex items-center justify-center min-h-screen">
        <span class="loading loading-spinner loading-lg"></span>
    </div>
    <div v-else-if="projectStore.error" role="alert" class="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ projectStore.error }}</span>
    </div>
    <div v-else>
        <div v-if="!projectStore.userJoinedProjects.projects || projectStore.userJoinedProjects.projects.length === 0"
            role="alert" class="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="stroke-info h-6 w-6 shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{
                projectStore.userJoinedProjects.id === authStore.authUser.id ? "Şimdilik herhangi bir projeye \
                katılmadın" : "Şimdilik Katıldığı bir proje yok" }}</span>
        </div>
        <div v-else class="grid gap-2 grid-cols-1">
            <div class="card bg-base-200 transition duration-300 hover:bg-base-300 w-full"
                v-for="project in projectStore.userJoinedProjects.projects" :key="project.id">
                <div class="card-body">
                    <RouterLink :to="{ name: 'user.profile', params: { username: project.User.username } }"
                        class="capitalize text-xs text-gray-400">
                        {{ project.User.firstName }} {{ project.User.lastName }}
                    </RouterLink>
                    <router-link :to="`/projects/${project.id}`">
                        <h2 class="card-title text-lg font-semibold capitalize cursor-pointer">
                            {{ project.title }}
                        </h2>
                    </router-link>

                    <RouterLink v-if="project.UserId === authStore.authUser.id"
                        :to="{ name: 'projects.applications', params: { id: project.id } }"
                        class="text-xs flex items-center ">
                        <span>Başvurular</span>
                        <svg-icon-vue type="mdi" :path="mdiOpenInNew" size="14"></svg-icon-vue>
                    </RouterLink>
                    <p class="line-clamp-2 text-pretty">{{ project.desc }}</p>
                    <div class="mt-1">
                        <div>
                            <div class="flex justify-between items-center mb-2">
                                <h3 class="font-semibold">Pozisyonlar</h3>
                                <span class="badge badge-md badge-info">{{
                                    project.Positions.length
                                }}</span>
                            </div>

                            <div class="flex flex-wrap gap-4 items-center">
                                <div v-for="position in project.Positions" :key="position.id">
                                    <h5 class="badge badge-outline text-sm p-3">
                                        {{ position.title }}
                                        <span :class="position.status === 'open'
                                            ? 'badge-success'
                                            : 'badge-error'
                                            " class="badge badge-sm ml-2"></span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { useAuthStore } from "@/stores/auth"
import svgIconVue from '@jamescoyle/vue-icon';
import { mdiOpenInNew } from '@mdi/js';


const authStore = useAuthStore()
const projectStore = useProjectStore()
const route = useRoute()

watch(
    () => route.params.username,
    (newUsername) => {
        if (newUsername) {
            projectStore.getUserJoinedProjects(newUsername)
        }
    }
)

onMounted(() => {
    projectStore.getUserJoinedProjects(route.params.username)
})
</script>