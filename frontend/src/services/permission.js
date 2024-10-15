import apiClient from './axios'

export const checkPermission = async (resource, param) => {
    try {
        const response = await apiClient.get(`/${resource}/${param}/check-ownership`)
        console.log(response.data.data)
        return response.data.data
    } catch (error) {
        console.log(error)
        return false
    }
}
