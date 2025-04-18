import axios from "axios";

const API_BASE_URL = " https://d1af-8-43-117-219.ngrok-free.app/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

export default axiosInstance;
