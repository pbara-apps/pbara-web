import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  const token: string | null =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("pbara-auth-session") || "{}")?.state
          ?.token || null
      : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
http.interceptors.response.use((response) => {
  return response?.data;
});
export default http;
