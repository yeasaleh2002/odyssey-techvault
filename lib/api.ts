import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Important for cookies (refreshToken)
  headers: {
    'Content-Type': 'application/json',
  },
});

// A variable to store access token in memory
let accessToken = '';

export const setAccessToken = (token: string) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh token
        const refreshResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = refreshResponse.data.accessToken;
        
        // Update memory token
        setAccessToken(newAccessToken);

        // Update authorization header of the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g., refresh token expired)
        setAccessToken('');
        // Optional: emit an event or directly redirect to login, handled in AuthContext usually
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
