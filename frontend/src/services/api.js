import axios from "axios";

export const api = axios.create({ baseURL: "http://localhost:8080" });

// Interceptor: agrega el token JWT en cada request si existe
api.interceptors.request.use((config) => {
  const stored = localStorage.getItem("user");
  if (stored) {
    try {
      const user = JSON.parse(stored);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    } catch {
      // localStorage corrupto, ignorar
    }
  }
  return config;
});
