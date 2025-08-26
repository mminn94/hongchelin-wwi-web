import api, { apiPath } from "./axiosInstance_CM";

export const getMyProfile = async () => {
  const { data } = await api.get(apiPath("/users/me"));
  return data;
};

export const updateMyNickname = async (nickname) => {
  const { data } = await api.put(apiPath("/users/me/nickname"), { nickname: nickname?.trim() });
  return data;
};

export async function updateMyProfileImage(file) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post(apiPath("/users/me/profile-image"), form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export const getMyPosts = async (page = 0, size = 12) => {
  const { data } = await api.get(apiPath("/users/me/posts"), { params: { page, size } });
  return Array.isArray(data)
    ? { content: data, number: page, size, totalElements: data.length, totalPages: 1 }
    : data;
};

export const setActiveBadge = async (badgeId) => {
  const { data } = await api.put(apiPath(`/users/me/badges/active/${badgeId}`));
  return data;
};
