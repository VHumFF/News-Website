import api from "./index"

export const categoriesApi = {
  getAll: () => api.get("/api/Categories"),
  getById: (id) => api.get(`/api/Categories/${id}`),
}
