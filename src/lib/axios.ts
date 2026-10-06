import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import envConfig from "@/src/config/envConfig";

const axiosInstance = axios.create({
  baseURL: envConfig.baseApi,
  withCredentials: true,
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && config && !config._retry) {
      config._retry = true;
      try {
        const res = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (res.ok) {
          return axiosInstance(config);
        }
      } catch {
        // fall through to reject
      }
    }

    const data = error.response?.data as
      | { message?: string; errorSources?: Array<{ message: string }> }
      | undefined;
    let errorMessage = "An unexpected error occurred";

    if (data?.errorSources?.length) {
      errorMessage = data.errorSources.map((e) => e.message).join(". ");
    } else if (data?.message) {
      errorMessage = data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return Promise.reject(new Error(errorMessage));
  },
);

export default axiosInstance;
