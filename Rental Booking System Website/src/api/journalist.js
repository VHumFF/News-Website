import api from "./index"

export const journalistApi = {
  validateActivation: (token) => api.get(`/api/journalists/validate-activation/${token}`),
  activate: (activationData) => api.post("/api/journalists/activate", activationData),
}
