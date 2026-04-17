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

// レスポンス時にトークン有効期限切れを検知
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // トークンをlocalStorageから削除
      localStorage.removeItem('auth-token');
      // ログインページにリダイレクト
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
