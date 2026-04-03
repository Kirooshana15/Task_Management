import axios from "axios";

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, 
});

// Add a request interceptor to attach the JWT token to every request
api.interceptors.request.use(
  (config) => {
    // We typically store the auth token in localStorage or a secure context
    const token = localStorage.getItem("serviceflow_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to globally handle common API errors
api.interceptors.response.use(
  (response) => {
    // Just return the raw response, or you can extract response.data here if preferred
    return response;
  },
  (error) => {
    // e.g. Automatically redirect to login if token expires (401)
    if (error.response && error.response.status === 401) {
      console.error("Authentication expired or invalid. Please login again.");
      localStorage.removeItem("serviceflow_token");
      // window.location.href = "/login"; // Uncomment when frontend routing for login is ready
    }
    return Promise.reject(error);
  }
);

export default api;
