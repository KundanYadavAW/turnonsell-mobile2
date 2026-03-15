import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseURL = "https://turnonsell.com";

const axiosInstance = axios.create({ baseURL });

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check for "TokenExpired" message from backend
    if (
      error.response?.status === 401 && 
      (error.response?.data?.message === "TokenExpired" || 
       error.response?.data?.message === "Invalid Token!") &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refresh");
        console.log("🔄 Attempting to refresh token...", refreshToken);
        
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${baseURL}/api/refresh`, { refreshToken });
        console.log("✅ Token refreshed successfully");
        
        const { token: newAccessToken, refreshToken: newRefreshToken } = res.data;

        await AsyncStorage.setItem("token", newAccessToken);
        await AsyncStorage.setItem("refresh", newRefreshToken);

        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        isRefreshing = false;

        return axiosInstance(originalRequest);
      } catch (refreshErr) {
        console.error("❌ Token refresh failed:", refreshErr);
        processQueue(refreshErr, null);
        isRefreshing = false;
        await AsyncStorage.clear();
        // The token is cleared, the app's root logic should handle navigation on auth state change
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

