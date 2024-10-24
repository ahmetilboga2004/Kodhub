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
        <div v-if="!projectStore.userProjects.projects || projectStore.userProjects.projects.length === 0" role="alert"
            class="alert">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                class="stroke-info h-6 w-6 shrink-0">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ projectStore.userProjects.id === authStore.authUser.id ? "Şimdilik herhangi bir projen \
                yok gibi görünüyor": "Şimdilik bir projesi bulunmuyor" }}</span>
        </div>
        <div v-else>
            <div class="grid gap-2 grid-cols-1">

                <div class="card bg-base-200 transition duration-300 hover:bg-base-300 w-full"
                    v-for="project in projectStore.userProjects.projects" :key="project.id">
                    <div class="card-body">
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
                        <div :class="project.UserId === authStore.authUser.id ? 'justify-between' : 'justify-end'"
                            class="card-actions items-center mt-2">
                            <button v-if="project.UserId === authStore.authUser.id" class="btn btn-error btn-sm"
                                @click="openModal(project)">
                                Sil
                            </button>
                            <div v-if="project.UserId === authStore.authUser.id" class=" flex items-center space-x-2">
                                <router-link :to="{
                                    name: 'projects.edit', params:
                                        { id: project.id }
                                }" class="btn btn-sm btn-neutral btn-outline">
                                    Düzenle
                                </router-link>
                                <!-- UPDATE STATUS BUTONU -->
                                <div v-if="project.status === 'filled' || project.status === 'in progress'"
                                    class="tooltip tooltip-bottom" :data-tip="getStatusUpdateTooltip(project.status)">
                                    <button class="btn btn-circle btn-sm"
                                        :class="getStatusUpdateButtonClass(project.status)"
                                        @click="openUpdateStatusModal(project)" :disabled="isUpdating">
                                        <span v-if="isUpdating" class="loading loading-spinner loading-sm"></span>
                                        <svgIconVue v-else type="mdi" :path="mdiPlay" size="24"></svgIconVue>
                                    </button>
                                </div>
                            </div>
                            <button v-if="project.UserId !== authStore.authUser.id"
                                class="btn justify-end btn-primary btn-sm" @click="applyModal(project)">
                                Projeye Başvur
                            </button>
                        </div>
                    </div>
                </div>
            </div>



            <div class=" flex justify-center">
                <Pagination :current-page="projectStore.currentPage.userProjects"
                    :total-pages="projectStore.totalPages.userProjects" :on-page-change="handlePageChange" />
            </div>
        </div>
    </div>

    <!-- Delete Modal -->
    <dialog ref="deleteModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Projeyi Sil</h3>
            <p class="py-2">Projeyi silmek istediğinizden emin misiniz?</p>
            <p class="text-warning">Silinen proje birdaha geri alınamaz</p>
            <div class="modal-action">
                <button class="btn" @click="closeModal">Vazgeç</button>
                <button class="btn btn-error" :disabled="isDeleting" @click="deleteProject">
                    <span v-if="isDeleting" class="loading loading-spinner loading-sm"></span>
                    Sil
                </button>
            </div>
        </div>
    </dialog>

    <!-- Update Status Modal -->
    <dialog ref="updateStatusModal" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="text-lg font-bold">Proje Durumunu Güncelle</h3>
            <p class="py-2">{{ getUpdateStatusConfirmationMessage() }}</p>
            <div class="modal-action">
                <button class="btn" @click="closeUpdateStatusModal">Vazgeç</button>
                <button class="btn btn-primary" :disabled="isUpdating" @click="confirmUpdateProjectStatus">
                    <span v-if="isUpdating" class="loading loading-spinner loading-sm"></span>
                    Evet, Güncelle
                </button>
            </div>
        </div>
    </dialog>

    <!-- Application Modal -->
    <ProjectApplicationModal ref="applicationModal" :project="selectedProject" @close="handleModalClose"
        v-if="selectedProject && !isDeleteModalOpen" />
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useProjectStore } from '@/stores/project'
import { useToast } from 'vue-toastification'
import { RouterLink } from 'vue-router'
import svgIconVue from '@jamescoyle/vue-icon'
import { mdiOpenInNew, mdiPlay } from '@mdi/js'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ProjectApplicationModal from '@/components/ProjectApplicationModal.vue'
import Pagination from '@/components/PaginationItem.vue'

const authStore = useAuthStore()
const route = useRoute()
const toast = useToast()
const projectStore = useProjectStore()
const applicationModal = ref(null)

const selectedProject = ref(null)

const deleteModal = ref(null)
const isDeleting = ref(false)
const isDeleteModalOpen = ref(false)

const openModal = (project) => {
    selectedProject.value = project
    isDeleteModalOpen.value = true
    nextTick(() => {
        deleteModal.value?.showModal()
    })
}

const closeModal = () => {
    deleteModal.value?.close()
    selectedProject.value = null
    isDeleteModalOpen.value = false
}

const deleteProject = async () => {
    if (!selectedProject.value) return

    isDeleting.value = true
    try {
        const message = await projectStore.deleteProject(selectedProject.value.id)
        toast.success(message)
        await projectStore.getUserProjects(route.params.username) // Listeyi yenile
        closeModal()
    } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Bir hata oluştu')
    } finally {
        isDeleting.value = false
    }
}

const applyModal = (project) => {
    if (isDeleteModalOpen.value) return
    selectedProject.value = project
    nextTick(() => {
        applicationModal.value?.showModal()
    })
}

const handleModalClose = () => {
    selectedProject.value = null
}

const updateStatusModal = ref(null)
const isUpdating = ref(false)

const getStatusUpdateTooltip = (status) => {
    if (status === "filled") return "Projeyi Başlat"
    if (status === "in progress") return "Projeyi Tamamla"
    return "Durum Güncelle"
}

const getStatusUpdateButtonClass = (status) => {
    if (status === "filled") return "btn-success"
    if (status === "in progress") return "btn-info"
    return "btn-primary"
}

const openUpdateStatusModal = (project) => {
    selectedProject.value = project
    nextTick(() => {
        updateStatusModal.value?.showModal()
    })
}

const closeUpdateStatusModal = () => {
    updateStatusModal.value?.close()
    selectedProject.value = null
}

const getUpdateStatusConfirmationMessage = () => {
    if (!selectedProject.value) return ''
    if (selectedProject.value.status === "filled") {
        return "Projeyi başlatmak istediğinizden emin misiniz?"
    }
    if (selectedProject.value.status === "in progress") {
        return "Projeyi tamamlamak istediğinizden emin misiniz?"
    }
    return "Proje durumunu güncellemek istediğinizden emin misiniz?"
}

const confirmUpdateProjectStatus = async () => {
    if (!selectedProject.value || isUpdating.value) return

    let newStatus
    if (selectedProject.value.status === "filled") {
        newStatus = "in progress"
    } else if (selectedProject.value.status === "in progress") {
        newStatus = "complated"
    } else {
        toast.warning("Bu proje durumu güncellenemez.")
        closeUpdateStatusModal()
        return
    }

    isUpdating.value = true
    try {
        const message = await projectStore.updateProjectStatus(selectedProject.value.id, newStatus)
        toast.success(message)
        await projectStore.getUserProjects(route.params.username)
        closeUpdateStatusModal()
    } catch (error) {
        console.error(error)
        toast.error(error.response?.data?.message || 'Durum güncellenirken bir hata oluştu')
    } finally {
        isUpdating.value = false
    }
}

const handlePageChange = (page) => {
    projectStore.getUserProjects(route.params.username, page)
}

watch(
    () => route.params.username,
    (newUsername) => {
        if (newUsername) {
            projectStore.getUserProjects(newUsername, 1)
        }
    }
)
watch(() => projectStore.filters.userProjects, () => {
    projectStore.getUserProjects(route.params.username, 1)
}, { deep: true })

onMounted(() => {
    if (route.params.username) {
        projectStore.getUserProjects(route.params.username, 1)
    }
})
</script>
