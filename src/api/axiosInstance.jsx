import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Attach token to every request if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle 401 Unauthorized errors
axiosInstance.interceptors.response.use(
  (response) => response, // pass successful responses through
  (error) => {
    if (error.response && error.response.status === 403) {
      // If server responds with 401, clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/CMHW-TOOLS/#/login";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
