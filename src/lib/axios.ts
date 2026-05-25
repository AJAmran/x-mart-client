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
      const data = error.response?.data;
      let errorMessage = "An unexpected error occurred";

      if (data?.errorSources?.length > 0) {
        errorMessage = data.errorSources
          .map((es: { path: string; message: string }) => es.message)
          .join(". ");
      } else if (data?.message) {
        errorMessage = data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      return Promise.reject(new Error(errorMessage));
    }
  }
);

export default axiosInstance;
