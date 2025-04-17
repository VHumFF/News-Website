import api from "./index"

export const adminApi = {
  registerJournalist: (journalistData) => api.post("/api/Admin/register-journalist", journalistData),
}
