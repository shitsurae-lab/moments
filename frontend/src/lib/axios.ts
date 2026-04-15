import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3080',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// リクエストのたびにトークンをヘッダーにセットする
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
