import axios from "axios";

import envConfig from "@/src/config/envConfig";
import { getNewAccessToken } from "@/src/services/AuthService";
import { cookies } from "next/headers";

const axiosInstance = axios.create({
  baseURL: envConfig.baseApi,
});

axiosInstance.interceptors.request.use(
  async function (config) {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  async function (error) {
    const config = error.config;

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true;
      const res = await getNewAccessToken();
      const accessToken = res.data.accessToken;

      config.headers["Authorization"] = `Bearer ${accessToken}`;
      const cookieStore = await cookies();
      cookieStore.set("accessToken", accessToken);

      return axiosInstance(config);
    } else {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred";
      return Promise.reject(new Error(errorMessage));
    }
  }
);

export default axiosInstance;
