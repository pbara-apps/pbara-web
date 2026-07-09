import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.response.use(
  (response) => response?.data,
  (error) => Promise.reject(error?.response?.data ?? error),
);

export default http;
