import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

const axiosClient = axios.create({
  baseURL,
  withCredentials: true, // sends the httpOnly refresh-token cookie
});

let accessToken = null;
export const setAccessToken = (token) => {
  accessToken = token;
};
export const getAccessToken = () => accessToken;

axiosClient.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshPromise = null;

/**
 * On a 401 (expired access token), silently calls /admin/auth/refresh using
 * the httpOnly cookie, retries the original request once. If refresh also
 * fails, the caller (AuthContext) redirects to /login. Concurrent 401s share
 * a single in-flight refresh call instead of each firing their own.
 */
axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry && !original.url.includes('/auth/')) {
      original._retry = true;
      try {
        if (!refreshPromise) {
          refreshPromise = axios
            .post(`${baseURL}/admin/auth/refresh`, {}, { withCredentials: true })
            .finally(() => {
              refreshPromise = null;
            });
        }
        const { data } = await refreshPromise;
        setAccessToken(data.data.accessToken);
        original.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosClient(original);
      } catch (refreshError) {
        setAccessToken(null);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
