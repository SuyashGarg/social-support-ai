import axios, { type AxiosResponse } from 'axios'

export const apiClient = axios.create({
    baseURL: '/api',
})

export const mockSubmitForm = async <T>(
    payload: T,
    delayMs = 1500,
): Promise<AxiosResponse<T>> => {
    return apiClient.request<T>({
        url: '/submit',
        method: 'POST',
        data: payload,
        adapter: (config) =>
            new Promise((resolve) => {
                window.setTimeout(() => {
                    resolve({
                        data: config.data as T,
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config,
                    })
                }, delayMs)
            }),
    })
}
