import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_ENDPOINTS, APP_CONFIG } from '../../config/constants';

class ApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            timeout: APP_CONFIG.apiTimeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.client.interceptors.response.use(
            response => response,
            async (error: AxiosError) => {
                if (error.response?.status === 429) {
                    console.warn('Rate limit exceeded. Please try again later.');
                }
                return Promise.reject(error);
            },
        );
    }

    async get<T>(url: string, params?: any): Promise<T> {
        const response = await this.client.get<T>(url, { params });
        return response.data;
    }

    async post<T>(url: string, data?: any): Promise<T> {
        const response = await this.client.post<T>(url, data);
        return response.data;
    }
}

export const twelveDataClient = new ApiClient(API_ENDPOINTS.twelveData);
export const coinGeckoClient = new ApiClient(API_ENDPOINTS.coinGecko);
