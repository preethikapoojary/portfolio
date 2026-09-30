import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../api/endpoints';
import { setAccessToken } from '../api/axiosClient';
import axios from 'axios';

const AuthContext = createContext(null);
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, attempt a silent refresh using the httpOnly cookie so a
  // page reload doesn't force a re-login every 15 minutes.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(`${baseURL}/admin/auth/refresh`, {}, { withCredentials: true });
        setAccessToken(data.data.accessToken);
        if (data.data.admin) {
          setAdmin(data.data.admin);
        } else {
          const me = await authApi.me();
          setAdmin(me.data);
        }
      } catch {
        setAdmin(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    setAccessToken(res.data.accessToken);
    setAdmin(res.data.admin);
  };

  const logout = async () => {
    await authApi.logout().catch(() => {});
    setAccessToken(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
