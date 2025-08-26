import api from "./axiosInstance";

const join = (...segs) =>
  "/" + segs.filter(Boolean).map(s => String(s).replace(/^\/|\/$/g, "")).join("/");

const COMMUNITY_ROOT = join("community");
const POSTS_PATH     = join(COMMUNITY_ROOT, "posts");
const COMMENTS_ROOT  = join(COMMUNITY_ROOT, "comments");

if (import.meta.env.DEV) {
  console.log("[COMMUNITY API]", {
    baseURL: api.defaults?.baseURL,
    COMMUNITY_ROOT,
    POSTS_PATH,
    COMMENTS_ROOT,
  });
}

const pickDefined = (obj) => Object.fromEntries(
  Object.entries(obj).filter(([, v]) =>
    v !== undefined && v !== null && !(typeof v === "string" && v.trim() === "")
  )
);


const clampRating = (n) => {
  const x = Number.isFinite(n) ? Math.round(n) : 0;
  return Math.min(5, Math.max(1, x));
};

const toList = (data) => {
  if (Array.isArray(data)) return data;
  if (data?.items && Array.isArray(data.items)) return data.items;
  if (data?.content && Array.isArray(data.content)) return data.content;
  return [];
};

const sanitizePostPayload = (postData) => pickDefined({
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
  const q = String(query ?? "").trim();
  if (q) params.query = q;

  const res = await api.get(POSTS_PATH, { params });
  return toList(res.data);
};

export const getCommunityPostsPage = async ({ query = "", page = 0, size = 10 } = {}) => {
  const params = { page, size };
  const q = String(query ?? "").trim();
  if (q) params.query = q;

  const res = await api.get(POSTS_PATH, { params });
  const data = res.data;
  return Array.isArray(data)
    ? { content: data, number: page, size, totalElements: data.length, totalPages: 1 }
    : data;
};

export const getCommunityPostById = async (postId) => {
  const res = await api.get(join(POSTS_PATH, postId));
  return res.data;
};

export const createCommunityPost = async (postData) => {
  const payload = sanitizePostPayload(postData);

  if (!payload.title) throw new Error("title이 비어있습니다.");
  if (!payload.restaurantName) throw new Error("restaurantName이 비어있습니다.");

  const res = await api.post(POSTS_PATH, payload);
  return res.data;
};


export const updateCommunityPost = async (postId, postData) => {
  const payload = sanitizePostPayload(postData);
  const res = await api.put(join(POSTS_PATH, postId), payload);
  return res.data;
};


export const deleteCommunityPost = async (postId) => {
  const res = await api.delete(join(POSTS_PATH, postId));
  return res.data;
};


export const getCommunityComments = async (postId) => {
  try {
    const res = await api.get(join(POSTS_PATH, postId, "comments"));
    return toList(res.data);
  } catch (e) {
    if (e.response?.status === 404) {
      return [];
    }
    throw e;
  }
};


export const createCommunityComment = async (postId, commentData) => {
  const res = await api.post(
    join(POSTS_PATH, postId, "comments"),
    pickDefined({ content: commentData.content?.trim() })
  );
  return res.data;
};


export const deleteCommunityComment = async (commentId) => {
  const res = await api.delete(join(COMMENTS_ROOT, commentId));
  return res.data;
};
