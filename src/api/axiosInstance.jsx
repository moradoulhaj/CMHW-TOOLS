import axios from "axios";

const API_BASE_URL = "https://fc79-2a00-1911-1-5284-714d-19e-f2f6-489e.ngrok-free.app/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default axiosInstance;
