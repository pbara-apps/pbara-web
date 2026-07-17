import axios from "axios";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

http.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

http.interceptors.response.use(
  (response) => response?.data,
  (error) => {
    const data = error?.response?.data;
    if (data && typeof data === "object") {
      return Promise.reject({
        ...data,
        statusCode: error.response?.status,
      });
    }

    return Promise.reject({
      message:
        error?.code === "ECONNABORTED"
          ? "The request timed out. Please try again."
          : (error?.message ?? "Network error"),
      statusCode: 0,
      code: error?.code,
      isNetworkError: true,
    });
  },
);

export default http;
