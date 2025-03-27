import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//token expired
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if response exists before accessing properties
    if (
      error.response.status === 401 &&
      !error.response.config.url.includes("/login")
    ) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
