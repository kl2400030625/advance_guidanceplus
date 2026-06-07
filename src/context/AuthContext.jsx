import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('gp_token');
    if (token) {
      api.me()
        .then(userData => {
          setUser(userData);
          return api.getProfile();
        })
        .then(profileData => setProfile(profileData))
        .catch(() => {
          localStorage.removeItem('gp_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('gp_token', data.token);
    setUser(data.user);
    const profileData = await api.getProfile().catch(() => null);
    setProfile(profileData);
    return data;
  };

  const register = async (formData) => {
    const data = await api.register(formData);
    localStorage.setItem('gp_token', data.token);
    setUser(data.user);
    const profileData = await api.getProfile().catch(() => null);
    setProfile(profileData);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('gp_token');
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    const profileData = await api.getProfile();
    setProfile(profileData);
    return profileData;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};
