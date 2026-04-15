import { useEffect, useState, useCallback } from 'react';
import axios from '@/lib/axios';

export const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }
    await axios
      .get('/api/user')
      .then(() => setIsLoggedIn(true))
      .catch(() => setIsLoggedIn(false))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const run = async () => {
      await checkAuth();
    };
    run();
  }, [checkAuth]);

  const logout = async () => {
    await axios.post('/api/logout');
    localStorage.removeItem('auth-token');
    setIsLoggedIn(false);
  };

  return { isLoggedIn, loading, logout, checkAuth }; // checkAuthを追加
};
