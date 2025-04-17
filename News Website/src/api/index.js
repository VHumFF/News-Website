import axios from "axios"

// Base URL for all API requests
const API_BASE_URL = "http://34.234.194.143:8080"

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

export default api
