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
    const currentPage = ref({
        all: 1,
        userProjects: 1,
        userJoined: 1
    })
    const totalPages = ref({
        all: 1,
        userProjects: 1,
        userJoined: 1
    })
    const filters = ref({
        all: { search: '', status: 'open' },
        userProjects: { search: '', status: 'all' },
        userJoined: { search: '', status: 'all' }
    })

    async function getAllProjects(page = 1, newFilters = null) {
        isLoading.value = true
        error.value = null
        try {
            if (newFilters) {
                filters.value.all = { ...filters.value.all, ...newFilters }
                currentPage.value.all = 1
            }

            const response = await apiClient.get('/projects', {
                params: {
                    page: newFilters ? currentPage.value.all : page,
                    status:
                        filters.value.all.status === 'all' ? undefined : filters.value.all.status,
                    search: filters.value.all.search || undefined
                }
            })

            if (response.data && response.data.data) {
                projects.value = response.data.data.projects || []
                totalPages.value.all = response.data.data.totalPages
                currentPage.value.all = response.data.data.currentPage
            } else {
                error.value = 'Veriler işlenirken bir hata oluştu'
            }
        } catch (err) {
            console.error(err)
            error.value = err.message || 'Projeler yüklenirken bir hata oluştu'
        } finally {
            isLoading.value = false
        }
    }

    const currentUsername = ref(null)

    function updateFilters(newFilters, type = 'all') {
        filters.value[type] = { ...filters.value[type], ...newFilters }
        if (type === 'all') {
            getAllProjects(1, newFilters)
        } else if (type === 'userProjects') {
            if (currentUsername.value) {
                getUserProjects(currentUsername.value, 1, newFilters)
            } else {
                console.error('Username bulunamadı')
            }
        } else if (type === 'userJoined') {
            if (currentUsername.value) {
                getUserJoinedProjects(currentUsername.value, 1, newFilters)
            } else {
                console.error('Username bulunamadı')
            }
        }
    }

    async function getUserProjects(username, page = 1, newFilters = null) {
        currentUsername.value = username
        isLoading.value = true
        error.value = null
        try {
            if (newFilters) {
                filters.value.userProjects = { ...filters.value.userProjects, ...newFilters }
                currentPage.value.userProjects = 1
            }
            const response = await apiClient.get(`/users/${username}/projects`, {
                params: {
                    page: newFilters ? currentPage.value.userProjects : page,
                    status:
                        filters.value.userProjects.status === 'all'
                            ? undefined
                            : filters.value.userProjects.status,
                    search: filters.value.userProjects.search || undefined
                }
            })
            if (response.data && response.data.data && Array.isArray(response.data.data.projects)) {
                userProjects.value = response.data.data
                totalPages.value.userProjects = response.data.data.totalPages
                currentPage.value.userProjects = response.data.data.currentPage
                console.log(response.data.data)
            } else {
                error.value = 'Veriler işlenirken bir hata oluştu'
            }
        } catch (err) {
            console.error(err)
            error.value = err.response?.data?.message || 'Projeleriniz yüklenirken bir hata oluştu'
        } finally {
            isLoading.value = false
        }
    }

    async function getUserJoinedProjects(username, page = 1, newFilters = null) {
        currentUsername.value = username
        isLoading.value = true
        error.value = null
        try {
            if (newFilters) {
                filters.value.userJoined = {
                    ...filters.value.userJoined,
                    ...newFilters
                }
                currentPage.value.userJoined = 1
            }
            const response = await apiClient.get(`/users/${username}/joined-projects`, {
                params: {
                    page: newFilters ? currentPage.value.userJoined : page,
                    status:
                        filters.value.userJoined.status === 'all'
                            ? undefined
                            : filters.value.userJoined.status,
                    search: filters.value.userJoined.search || undefined
                }
            })
            if (response.data && response.data.data && Array.isArray(response.data.data.projects)) {
                userJoinedProjects.value = response.data.data
                totalPages.value.userJoined = response.data.data.totalPages
                currentPage.value.userJoined = response.data.data.currentPage
                console.log(response.data.data)
            } else {
                error.value = 'Veriler işlenirken bir hata oluştu'
            }
        } catch (err) {
            console.log(err)
            error.value = err.message
        } finally {
            isLoading.value = false
        }
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
        currentUsername,
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
