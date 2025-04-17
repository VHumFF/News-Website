import api from "./index"

export const articlesApi = {
  getTrending: () => api.get("/api/Articles/trending"),
  getLatest: (page, pageSize) => api.get("/api/Articles/latest", page, pageSize),
  getById: (id) => api.get(`/api/Articles/${id}`),
  getByCategory: (categoryId, listType) => api.get(`/api/Articles/category/${categoryId}`, listType),
  search: (options) => api.get("/api/Articles/search", options),
  create: (articleData) => api.post("/api/Articles", articleData),
  update: (articleId, articleData) => api.put(`/api/Articles/${articleId}`, articleData),
  delete: (articleId) => api.delete(`/api/Articles/${articleId}`),
  publish: (articleId) => api.put(`/api/Articles/${articleId}/publish`),
  getJournalistArticles: (status, page = 1, pageSize = 10) =>
    api.get(`/journalist/articles?status=${status}&page=${page}&pageSize=${pageSize}`),
  like: (articleId) => api.post(`/api/likes/article/${articleId}/like`),
  unlike: (articleId) => api.delete(`/api/likes/article/${articleId}/unlike`),
}
