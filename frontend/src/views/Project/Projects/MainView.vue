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
        <div v-if="!projectStore.projects || projectStore.projects.length === 0" role="alert" class="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="stroke-info h-6 w-6 shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Şimdilik bir Proje yok gibi görünüyor</span>
        </div>
        <div v-else>
            <div class="grid gap-2 grid-cols-1">
                <div class="card bg-base-200 transition duration-300 hover:bg-base-300 w-full"
                    v-for="project in projectStore.projects" :key="project.id">
                    <div class="card-body">
                        <div class="flex flex-col items-start">
                            <RouterLink :to="{ name: 'user.profile', params: { username: project.User.username } }"
                                class="capitalize text-xs text-gray-400 mb-1">
                                {{ project.User.firstName }} {{ project.User.lastName }}
                            </RouterLink>
                            <router-link :to="`/projects/${project.id}`">
                                <h2 class="card-title text-lg font-semibold capitalize">
                                    {{ project.title }}
                                </h2>
                            </router-link>
                        </div>
                        <p class="line-clamp-2 text-pretty">{{ project.desc }}</p>
                        <div class="mt-2">
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
                        <div class="card-actions justify-end mt-2">
                            <button class="btn btn-primary btn-sm" @click="openModal(project)">
                                Projeye Başvur
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class=" flex justify-center">
                <Pagination :current-page="projectStore.currentPage.all" :total-pages="projectStore.totalPages.all"
                    :on-page-change="handlePageChange" />
            </div>

        </div>


        <ProjectApplicationModal ref="applicationModal" :project="selectedProject" @close="handleModalClose"
            v-if="selectedProject" />
    </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useProjectStore } from '@/stores/project'
import ProjectApplicationModal from '@/components/ProjectApplicationModal.vue'
import Pagination from '@/components/PaginationItem.vue';

const applicationModal = ref(null)
const selectedProject = ref(null)

const openModal = (project) => {
    selectedProject.value = project
    nextTick(() => {
        applicationModal.value?.showModal()
    })
}

const handleModalClose = () => {
    selectedProject.value = null
}

const projectStore = useProjectStore()

const handlePageChange = (page) => {
    console.log('Page change requested:', page)
    projectStore.getAllProjects(page)
}

onMounted(() => {
    projectStore.getAllProjects()
})

// Filtrelerin değişimini izle
watch(() => projectStore.filters.all, () => {
    projectStore.getAllProjects(1) // Filtreler değiştiğinde ilk sayfaya dön
}, { deep: true })
</script>
