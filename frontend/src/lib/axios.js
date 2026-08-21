import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

export const API_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: baseURL || "http://localhost:3000/api",
  withCredentials: true,
});

// Intercept outgoing requests to attach Clerk Auth Token
api.interceptors.request.use(async (config) => {
  if (window.Clerk?.session) {
    const token = await window.Clerk.session.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;