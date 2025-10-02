// src/services/api/apiClient.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class APIClient {
    protected client: AxiosInstance;

    constructor(baseURL: string, config?: AxiosRequestConfig) {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            ...config
        });

        this.setupInterceptors();
    }

    private setupInterceptors(): void {
        this.client.interceptors.request.use(
            (config) => {
                // Add request timestamp
                config.headers['X-Request-Time'] = Date.now().toString();
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.client.interceptors.response.use(
            (response) => response,
            async (error) => {
                if (error.response?.status === 429) {
                    // Rate limited - wait and retry
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return this.client.request(error.config);
                }
                return Promise.reject(error);
            }
        );
    }

    protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.get<T>(url, config);
        return response.data;
    }

    protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        const response = await this.client.post<T>(url, data, config);
        return response.data;
    }
}