import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import envConfig from "@/src/config/envConfig";

const axiosInstance = axios.create({
  baseURL: envConfig.baseApi,
  withCredentials: true, // send httpOnly cookies on every request
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

axiosInstance.interceptors.request.use(
  (config) => {
    // C-10 FIX: access token is now httpOnly. We do NOT read it from JS.
    // The browser sends it automatically as a cookie. The Authorization
    // header is reserved for backend-to-backend or service tokens.
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    if (status === 401 && config && !config._retry) {
      config._retry = true;
      try {
        // Hit the same-origin server action (NOT the backend directly), so the
        // httpOnly cookie is read by Next.js and used to mint a new access
        // token that is set as a fresh httpOnly cookie.
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
  }
);

export default axiosInstance;
