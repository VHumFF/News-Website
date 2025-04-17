import api from "./index"

export const commentsApi = {
  getByArticle: (articleId) => api.get(`/api/comments/${articleId}`),
  create: (commentData) => api.post("/api/comments", commentData),
  delete: (commentId) => api.delete(`/api/comments/${commentId}`),
}
