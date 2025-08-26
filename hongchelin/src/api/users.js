import api from "./axiosInstance";

const join = (...segs) =>
  "/" + segs.filter(Boolean).map(s => String(s).replace(/^\/|\/$/g, "")).join("/");

const USERS_PATH = join("users");
const ME_PATH    = join(USERS_PATH, "me");

if (import.meta.env.DEV) {
  console.log("[USER API]", {
    baseURL: api.defaults?.baseURL,
    USERS_PATH,
    ME_PATH,
  });
}

export const getMyProfile = async () => {
  const res = await api.get(ME_PATH);
  return res.data;
};

export const updateMyNickname = async (nickname) => {
  const res = await api.put(join(ME_PATH, "nickname"), { nickname: nickname?.trim() });
  return res.data;
};

export async function updateMyProfileImage(file) {
  const form = new FormData();
  form.append("file", file);   // ← 반드시 "file" 키여야 함
  const res = await api.post(join(ME_PATH, "profile-image"), form, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return res.data;
}

export const getMyPosts = async (page = 0, size = 12) => {
  const res = await api.get(join(ME_PATH, "posts"), { params: { page, size } });
  const data = res.data;
  return Array.isArray(data)
    ? { content: data, number: page, size, totalElements: data.length, totalPages: 1 }
    : data;
};

export const setActiveBadge = async (badgeId) => {
  const res = await api.put(join(ME_PATH, "badges", "active", badgeId));
  return res.data;
};
