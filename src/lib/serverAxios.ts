import envConfig from "@/src/config/envConfig";
import { cookies } from "next/headers";

/**
 * SSR fetch wrapper.
 *
 * Why this file exists:
 *  - The old `axiosInstance` set cookies in a response interceptor, which
 *    throws in Next 15+ App Router. We keep a small `axiosInstance`-shaped
 *    object here so existing server-action code (OrderService, PaymentService,
 *    ProductServices, UserService, BranchService, hooks) keeps working
 *    without a large refactor.
 *  - The browser's cookies are forwarded on every call so the backend's
 *    `authMiddleware` (which now reads the access token from the cookie)
 *    continues to authenticate the request.
 *  - On 401 we transparently call /api/auth/refresh and retry once.
 *
 *  `serverFetch` is also exported as a modern alternative for new code.
 */

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
): Promise<{ data: T; status: number }> => {
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
  let json: { data?: T; message?: string; meta?: unknown; errorSources?: Array<{ message: string }> } | null = null;

  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }
  if (!res.ok) {
    throw new HttpError(extractErrorMessage(json, `Request failed (${res.status})`), res.status);
  }

  // Return the full response body so consumers can read `.data`, `.meta`,
  // `.message`, etc. — mirrors axios's default `response.data` shape and the
  // wrapper returned by the backend's `sendResponse`.
  return { data: (json ?? ({} as { data?: T })) as { data?: T; meta?: unknown; message?: string }, status: res.status };
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
