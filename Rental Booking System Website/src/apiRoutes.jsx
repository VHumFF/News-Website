import axios from "axios"

// Base URL for all API requests
const API_BASE_URL = "https://wise-plaza-sponsors-sink.trycloudflare.com"

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is due to unauthorized access (401)
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized access detected, redirecting to login page")

      // Clear the auth token
      localStorage.removeItem("authToken")

      // Redirect to login page if we're not already there
      const currentPath = window.location.pathname
      if (!currentPath.includes("/login")) {
        // Use window.location for a full page reload to clear any state
        window.location.href = "/login"
      }
    }

    // Return the error for further processing
    return Promise.reject(error)
  },
)

// Auth endpoints
export const authApi = {
  login: (credentials) => api.post("/api/Auth/login", credentials),
  register: (userData) => api.post("/api/Auth/register", userData),
  changePassword: (passwordData) => api.post("/api/Auth/change-password", passwordData),
  activateAccount: (token) => api.post(`/api/Auth/activate-account/${token}`),
  resendActivation: (email) => api.post("/api/Auth/resend-activation", { email }),
  forgotPassword: (email) => api.post("/forgot-password", { email }),
  resetPassword: (token, newPassword) => api.post("/reset-password", { token, newPassword }),
}

// Articles endpoints
export const articlesApi = {
  getTrending: () => api.get("/api/Articles/trending"),
  getLatest: () => api.get("/api/Articles/latest"),
  getById: (id) => api.get(`/api/Articles/${id}`),
  getByCategory: (categoryId) => api.get(`/api/Articles/category/${categoryId}`),
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

// Categories endpoints
export const categoriesApi = {
  getAll: () => api.get("/api/Categories"),
  getById: (id) => api.get(`/api/Categories/${id}`),
}

// Comments endpoints
export const commentsApi = {
  getByArticle: (articleId) => api.get(`/api/comments/${articleId}`),
  create: (commentData) => api.post("/api/comments", commentData),
  delete: (commentId) => api.delete(`/api/comments/${commentId}`),
}

// Admin endpoints
export const adminApi = {
  registerJournalist: (journalistData) => api.post("/api/Admin/register-journalist", journalistData),
}

// File upload endpoints
export const fileApi = {
  getPresignedUrl: (extension = "jpg") => api.get(`/presigned-url?extension=${extension}`),
}

// Error handler helper
export const handleApiError = (error) => {
  const defaultMessage = "An error occurred. Please try again."

  if (!error.response) {
    return {
      message: "Network error. Please check your connection.",
      status: 0,
    }
  }

  const { status, data } = error.response

  return {
    message: data.message || defaultMessage,
    status,
    data: data,
  }
}

// Add likesApi for comment likes/unlikes
export const likesApi = {
  likeComment: (commentId) => api.post(`/api/likes/comment/${commentId}/like`),
  unlikeComment: (commentId) => api.delete(`/api/likes/comment/${commentId}/unlike`),
}

export default {
  auth: authApi,
  articles: articlesApi,
  categories: categoriesApi,
  comments: commentsApi,
  admin: adminApi,
  file: fileApi,
  likes: likesApi,
}
