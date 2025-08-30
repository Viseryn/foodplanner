import axios, { AxiosInstance } from "axios"

export const apiClient: AxiosInstance = axios.create({
    // @ts-expect-error: Vite env
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})

apiClient.defaults.headers.post['Content-Type'] = 'application/ld+json'
apiClient.defaults.headers.put['Content-Type'] = 'application/ld+json'
apiClient.defaults.headers.patch['Content-Type'] = 'application/merge-patch+json'
