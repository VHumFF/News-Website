import api from "./index"

export const likesApi = {
  likeComment: (commentId) => api.post(`/api/likes/comment/${commentId}/like`),
  unlikeComment: (commentId) => api.delete(`/api/likes/comment/${commentId}/unlike`),
}
