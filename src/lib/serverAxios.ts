import envConfig from "@/src/config/envConfig";
import { cookies } from "next/headers";


class HttpError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

const buildHeaders = (cookieHeader: string, extra?: HeadersInit) => {
  const headers = new Headers(extra);

  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (cookieHeader) headers.set("cookie", cookieHeader);

  return headers;
};

const extractErrorMessage = (data: { message?: string; errorSources?: Array<{ message: string }> } | null, fallback: string) =>
  data?.errorSources?.map((e) => e.message).join(". ") ??
  data?.message ??
  fallback;

const tryRefresh = async (origin: string): Promise<boolean> => {
  try {
    const res = await fetch(`${origin}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    return res.ok;
  } catch {
    return false;
  }
};

const isServer = typeof window === "undefined";

const getOrigin = () => {
  if (!isServer) return "";

  // On Vercel this is provided by the platform. Locally it falls back to localhost.
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000"
  );
};

const doFetch = async <T = unknown>(
  method: string,
  path: string,
  data?: unknown,
  init: RequestInit & { headers?: Record<string, string>; _retry?: boolean } = {}
): Promise<AxiosLikeResponse<T>> => {
  const url = `${envConfig.baseApi}${path}`;
  const cookieHeader = isServer ? (await cookies()).toString() : "";
  const headers = buildHeaders(cookieHeader, init.headers);

  const fetchInit: RequestInit = {
    method,
    headers,
    cache: "no-store",
    credentials: isServer ? "omit" : "include",
  };

  if (data !== undefined) {
    fetchInit.body = typeof data === "string" ? data : JSON.stringify(data);
  }

  const res = await fetch(url, fetchInit);

  if (res.status === 401 && !init._retry && isServer) {
    const refreshed = await tryRefresh(getOrigin());

    if (refreshed) {
      return doFetch<T>(method, path, data, { ...init, _retry: true });
    }
  }

  const text = await res.text();
  let json: unknown = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  type ErrorBody = { message?: string; errorSources?: Array<{ message: string }> };

  if (!res.ok) {
    throw new HttpError(
      extractErrorMessage(json as ErrorBody | null, `Request failed (${res.status})`),
      res.status
    );
  }
  
  return { data: (json ?? {}) as T, status: res.status };
};

type AxiosLikeConfig = {
  url?: string;
  method?: string;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  withCredentials?: boolean;
  _retry?: boolean;
};

type AxiosLikeResponse<T = unknown> = { data: T; status: number };

/** Envelope shape every list endpoint returns. */
type TEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: { page: number; limit: number; total: number; totalPages: number };
};

const buildPath = (cfg: AxiosLikeConfig, fallback: string) => {
  let path = cfg.url ?? fallback;

  if (cfg.params) {
    const qs = new URLSearchParams();

    for (const [k, v] of Object.entries(cfg.params)) {
      if (v !== undefined && v !== null) qs.append(k, String(v));
    }
    const s = qs.toString();

    if (s) path += (path.includes("?") ? "&" : "?") + s;
  }

  return path;
};

const axiosInstance = {
  async request<T = unknown>(cfg: AxiosLikeConfig): Promise<AxiosLikeResponse<T>> {
    const path = buildPath(cfg, "");

    return doFetch<T>(cfg.method ?? "GET", path, cfg.data, { headers: cfg.headers, _retry: cfg._retry });
  },
  async post<T = unknown>(url: string, data?: unknown, cfg: AxiosLikeConfig = {}): Promise<AxiosLikeResponse<T>> {
    const path = buildPath({ url, params: cfg.params }, url);

    return doFetch<T>("POST", path, data, { headers: cfg.headers, _retry: cfg._retry });
  },
  async get<T = unknown>(url: string, cfg: AxiosLikeConfig = {}): Promise<AxiosLikeResponse<T>> {
    const path = buildPath({ url, params: cfg.params }, url);

    return doFetch<T>("GET", path, undefined, { headers: cfg.headers, _retry: cfg._retry });
  },
  async patch<T = unknown>(url: string, data?: unknown, cfg: AxiosLikeConfig = {}): Promise<AxiosLikeResponse<T>> {
    const path = buildPath({ url, params: cfg.params }, url);

    return doFetch<T>("PATCH", path, data, { headers: cfg.headers, _retry: cfg._retry });
  },
  async put<T = unknown>(url: string, data?: unknown, cfg: AxiosLikeConfig = {}): Promise<AxiosLikeResponse<T>> {
    const path = buildPath({ url, params: cfg.params }, url);

    return doFetch<T>("PUT", path, data, { headers: cfg.headers, _retry: cfg._retry });
  },
  async delete<T = unknown>(url: string, cfg: AxiosLikeConfig = {}): Promise<AxiosLikeResponse<T>> {
    const path = buildPath({ url, params: cfg.params }, url);

    return doFetch<T>("DELETE", path, cfg.data, { headers: cfg.headers, _retry: cfg._retry });
  },
};

export default axiosInstance;
export { HttpError };
export const serverFetch = doFetch;
export type { TEnvelope };
