import api from "./index"

export const authApi = {
  login: (credentials) => api.post("/api/Auth/login", credentials),
  register: (userData) => api.post("/api/Auth/register", userData),
  changePassword: (passwordData) =>
    api.post("/api/Auth/change-password", {
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    }),
  activateAccount: (token) => api.post(`/api/Auth/activate-account/${token}`),
  resendActivation: (email) => api.post("/api/Auth/resend-activation", { email }),
  forgotPassword: (email) => api.post("/forgot-password", { email }),
  resetPassword: (token, newPassword) => api.post("/reset-password", { token, newPassword }),
}
