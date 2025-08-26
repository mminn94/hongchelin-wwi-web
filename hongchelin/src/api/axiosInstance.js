import axios from "axios";

const rawBase = import.meta.env.VITE_API_URL || "";
const rawPref = import.meta.env.VITE_API_PREFIX || "/api";

const isLocal =
  typeof window !== "undefined" &&
  /^(localhost|127\.0\.0\.1|192\.168\.|10\.|172\.(1[6-9]|2\d|3[0-1]))$/.test(window.location.hostname);

const baseURL = isLocal
  ? "/api"
  : (rawBase
      ? `${rawBase.replace(/\/+$/, "")}${rawPref.startsWith("/") ? rawPref : `/${rawPref}`}`
      : "/api");

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  config.headers["X-USER-ID"] = "1";
  if (!config.headers["Accept"]) config.headers["Accept"] = "application/json";

  if (import.meta.env.DEV) {
    console.log("[API REQ]", (config.method || "get").toUpperCase(), (config.baseURL || "") + (config.url || ""));
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (e) => {
    const url = e?.config ? `${e.config.baseURL || ""}${e.config.url || ""}` : "";
    console.error("[API ERR]", e?.code || e?.response?.status, url, e?.message, e?.response?.data);
    return Promise.reject(e);
  }
);

export default api;
