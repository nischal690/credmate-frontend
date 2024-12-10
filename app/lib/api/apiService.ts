import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { API_BASE_URL, API_VERSION, API_TIMEOUTS, API_STATUS } from './config';

// Define the RefreshTokenResponse type
interface RefreshTokenResponse {
  token: string;
  expiresIn?: number; // Optional field for token expiration time
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/${API_VERSION}`,
      timeout: API_TIMEOUTS.DEFAULT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Handle unauthorized access
        if (error.response?.status === API_STATUS.UNAUTHORIZED) {
          // Try to refresh token if available
          const refreshToken = localStorage.getItem('refreshToken');
          if (refreshToken && originalRequest) {
            try {
              const { token, expiresIn } = await this.post<RefreshTokenResponse>('/auth/refresh-token', { refreshToken });
              localStorage.setItem('token', token);
              if (expiresIn) {
                localStorage.setItem('expiresIn', expiresIn.toString());
              }
              // Retry the original request
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              return this.api(originalRequest);
            } catch (refreshError) {
              // If refresh token fails, logout user
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              window.location.href = '/login';
              return Promise.reject(refreshError);
            }
          } else {
            // No refresh token available, logout user
            localStorage.removeItem('token');
            window.location.href = '/login';
          }
        }

        // Handle other errors
        return Promise.reject(error);
      }
    );
  }

  // Generic GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.get<T>(url, config);
    return response.data;
  }

  // Generic POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.post<T>(url, data, config);
    return response.data;
  }

  // Generic PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.put<T>(url, data, config);
    return response.data;
  }

  // Generic DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.api.delete<T>(url, config);
    return response.data;
  }

  // File upload request with custom timeout
  async uploadFile<T>(url: string, file: File, config?: AxiosRequestConfig): Promise<T> {
    const formData = new FormData();
    formData.append('file', file);

    const uploadConfig: AxiosRequestConfig = {
      ...config,
      timeout: API_TIMEOUTS.UPLOAD,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    const response = await this.api.post<T>(url, formData, uploadConfig);
    return response.data;
  }
}

// Create a singleton instance
const apiService = new ApiService();
export default apiService;
