import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true,
  timeout: 10000,
});

// Track if we are currently refreshing the token
let isRefreshing = false;

// pending requests array
let pendingRequests: any[] = [];

// add pending request to the queue
const processQueue = (error: any, token = null) => {
  pendingRequests.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
};

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
  async (error) => {
    const originalRequest = error.config;
    // Check if it's a 401 and not already retried
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login")
    ) {
      if (isRefreshing) {
        // If we are already refreshing, add the request to the processQueue

        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await apiClient.post(
          "/users/refresh-token", 
          { refreshToken }
        );

        if (response.data.success) {
          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          localStorage.setItem("token", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          processQueue(null, accessToken); // Resolve all pending requests

          return apiClient(originalRequest); // Retry the original request
        } else {
          // Refresh failed, logout user
          processQueue(new Error("Refresh token failed"));
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Handle refresh error - logout user
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }

      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
