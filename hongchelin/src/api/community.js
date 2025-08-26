import api, { apiPath } from "./axiosInstance_CM";

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.content && Array.isArray(data.content)) return data.content;
  return [];
};

const pickDefined = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) =>
        v !== undefined && v !== null && !(typeof v === "string" && v.trim() === "")
    )
  );

const clampRating = (n) => {
  const x = Number.isFinite(n) ? Math.round(n) : 0;
  return Math.min(5, Math.max(1, x));
};

const sanitizePostPayload = (postData) =>
  pickDefined({
    title: postData.title?.trim(),
    content: postData.content?.trim(),
    restaurantName: postData.restaurantName?.trim(),
    recommendedMenu: postData.recommendedMenu?.trim(),
    imageUrl: postData.imageUrl?.trim(),
    rating: clampRating(postData.rating),
    createdDate: postData.createdAtKst,
  });

export const getCommunityPosts = async ({ query = "", page = 0, size = 10 } = {}) => {
  const params = { page, size };
  if (query?.trim()) params.query = query.trim();
  const { data } = await api.get(apiPath("/community/posts"), { params });
  return toList(data);
};

export const getCommunityPostById = async (postId) => {
  const { data } = await api.get(apiPath(`/community/posts/${postId}`));
  return data;
};

export const createCommunityPost = async (postData) => {
  const payload = sanitizePostPayload(postData);
  if (!payload.title) throw new Error("title이 비어있습니다.");
  if (!payload.restaurantName) throw new Error("restaurantName이 비어있습니다.");
  const { data } = await api.post(apiPath("/community/posts"), payload);
  return data;
};

export const updateCommunityPost = async (postId, postData) => {
  const payload = sanitizePostPayload(postData);
  const { data } = await api.put(apiPath(`/community/posts/${postId}`), payload);
  return data;
};

export const deleteCommunityPost = async (postId) => {
  const { data } = await api.delete(apiPath(`/community/posts/${postId}`));
  return data;
};

export const getCommunityComments = async (postId) => {
  try {
    const { data } = await api.get(apiPath(`/community/posts/${postId}/comments`));
    return toList(data);
  } catch (e) {
    if (e.response?.status === 404) return [];
    throw e;
  }
};

export const createCommunityComment = async (postId, commentData) => {
  const { data } = await api.post(
    apiPath(`/community/posts/${postId}/comments`),
    pickDefined({ content: commentData.content?.trim() })
  );
  return data;
};

export const deleteCommunityComment = async (commentId) => {
  const { data } = await api.delete(apiPath(`/community/comments/${commentId}`));
  return data;
};
