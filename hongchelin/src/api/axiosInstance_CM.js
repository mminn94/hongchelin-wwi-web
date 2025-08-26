import axios from "axios";

function isAbsoluteUrl(url = "") {
  return /^https?:\/\//i.test(url);
}

const envBase = import.meta.env.VITE_API_URL;
if (!envBase || !isAbsoluteUrl(envBase)) {
  throw new Error(
    `[axios] VITE_API_URL must be an absolute URL, got: "${envBase}". ` +
      `Set e.g. VITE_API_URL=http://192.168.0.10:8080 in your .env file.`
  );
}
const BASE_URL = envBase.replace(/\/$/, "");

const rawPrefix = (import.meta.env.VITE_API_PREFIX ?? "").trim();
export const ROUTE_PREFIX = rawPrefix
  ? `/${rawPrefix.replace(/^\/+|\/+$/g, "")}`
  : "";

function normalizePath(p = "") {
  return `/${String(p).replace(/^\/+/, "")}`;
}

export function apiPath(p = "") {
  return `${ROUTE_PREFIX}${normalizePath(p)}`;
}

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  timeout: 15000,
});

const AUTH_EXCLUDE_REGEX =
  /\/(?:auth\/)?login\b|\/(?:auth\/)?signup\b|\/oauth\/|\/auth\/email\//;

api.interceptors.request.use((config) => {
  const url = config.url || "";
  config.headers = config.headers ?? {};

  const target = isAbsoluteUrl(url)
    ? url
    : `${api.defaults.baseURL}/${url.replace(/^\//, "")}`;


  if (AUTH_EXCLUDE_REGEX.test(target)) {
    delete config.headers.Authorization;
  } else {
    const token = localStorage.getItem("accessToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    else delete config.headers.Authorization;
  }

  const isBodyObject =
    config.data &&
    typeof config.data === "object" &&
    !(config.data instanceof FormData) &&
    !(config.data instanceof Blob) &&
    !(config.data instanceof ArrayBuffer);

  if (isBodyObject && !config.headers["Content-Type"]) {
    config.headers["Content-Type"] = "application/json";
  }
  if (!config.headers["Accept"]) {
    config.headers["Accept"] = "application/json";
  }

  if (import.meta.env.DEV) {
    console.log("[API REQ]", config.method?.toUpperCase(), target);
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    if (import.meta.env.DEV) {
      console.log("[API RES]", res.status, res.config.url);
    }
    return res;
  },
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("accessToken");
    }
    const url = error?.config ? `${error.config.baseURL || ""}${error.config.url || ""}` : "";
    console.error("[API ERR]", error?.code || status, url, error?.message, error?.response?.data);
    return Promise.reject(error);
  }
);

export default api;
