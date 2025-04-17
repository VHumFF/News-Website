import api from "./index"

export const fileApi = {
  getPresignedUrl: (extension = "jpg") => api.get(`/presigned-url?extension=${extension}`),
}
