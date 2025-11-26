import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000", // A porta onde o teu Back-End está a rodar
});

// Interceptor: Toda vez que fizermos um pedido, ele verifica se tem token salvo
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fitup_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
