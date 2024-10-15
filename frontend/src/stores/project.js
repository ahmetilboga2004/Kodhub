import { defineStore } from 'pinia'
import apiClient from '@/services/axios'
import { ref } from 'vue'

export const useProjectStore = defineStore('project', () => {
    const project = ref(null)
    const projects = ref([])
    const userProjects = ref([])
    const userJoinedProjects = ref([])
    const applications = ref({})
    const profile = ref({})
    const isLoading = ref(false)
    const error = ref(null)
    const currentPage = ref(1) // Şu anki sayfa
    const totalPages = ref(1) // Toplam sayfa sayısı
    const filters = ref({
        search: '',
        status: 'open'
    })

    async function getAllProjects(page = 1) {
        isLoading.value = true
        error.value = null
        try {
            const response = await apiClient.get('/projects', {
                params: {
                    page,
                    status: filters.value.status,
                    search: filters.value.search
                }
            })
            if (response.data && response.data.data && Array.isArray(response.data.data.projects)) {
                projects.value = response.data.data.projects
                totalPages.value = response.data.data.totalPages
                currentPage.value = response.data.data.currentPage
            } else {
                throw new Error('Invalid API response format')
            }
        } catch (err) {
            console.error(err)
            error.value = err.message || 'Projeler yüklenirken bir hata oluştu'
        } finally {
            isLoading.value = false
        }
    }

    function updateFilters(newFilters) {
        filters.value = { ...filters.value, ...newFilters }
        getAllProjects(1) // Filtreleri güncelledikten sonra ilk sayfadan başla
    }

    async function getProjectDetails(id) {
        isLoading.value = true
        error.value = null
        try {
            const response = await apiClient.get(`/projects/${id}`)
            project.value = response.data.data
            console.log(response.data.data)
        } catch (err) {
            console.error(err)
            error.value = err.message || 'Bir hata oluştu'
        } finally {
            isLoading.value = false
        }
    }

    async function getUserProjects(username) {
        isLoading.value = true
        error.value = null
        try {
            const response = await apiClient.get(`/users/${username}/projects`)
            userProjects.value = response.data.data
            console.log(response.data.data)
        } catch (err) {
            console.error(err)
            error.value = err.response.data.message || 'Projeleriniz yüklenirken bir hata oluştu'
        } finally {
            isLoading.value = false
        }
    }

    async function getUserJoinedProjects(username) {
        isLoading.value = true
        error.value = null
        try {
            const response = await apiClient.get(`/users/${username}/joined-projects`)
            userJoinedProjects.value = response.data.data
            console.log(response.data.data)
        } catch (err) {
            console.log(err)
            error.value = err.message
        } finally {
            isLoading.value = false
        }
    }

    async function deleteProject(id) {
        try {
            const response = await apiClient.delete(`/projects/${id}`)
            return response.data.message
        } catch (err) {
            console.error(err)
            error.value = err
        }
    }

    async function getApplications(id) {
        isLoading.value = true
        error.value = null
        try {
            const response = await apiClient.get(`/projects/${id}/applications`)
            applications.value = response.data.data
            console.log(response.data.data)
        } catch (err) {
            console.error(err)
            error.value = err.response.data.message
        } finally {
            isLoading.value = false
        }
    }

    async function getProfile(username) {
        isLoading.value = true
        error.value = null
        try {
            const response = await apiClient.get(`/users/${username}/profile`)
            profile.value = response.data.data
            console.log(response.data.data)
        } catch (err) {
            console.error(err)
            error.value = err.response.data.message
        }
    }

    return {
        project,
        projects,
        currentPage,
        totalPages,
        filters,
        updateFilters,
        userProjects,
        userJoinedProjects,
        applications,
        profile,
        isLoading,
        error,
        getProjectDetails,
        getAllProjects,
        getUserProjects,
        getUserJoinedProjects,
        deleteProject,
        getApplications,
        getProfile
    }
})
