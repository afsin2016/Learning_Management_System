import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('lms_token') || null);
  const [loading, setLoading] = useState(true);

  // Initialize auth from localStorage & verify with backend
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('lms_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to authenticate token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: jwtToken, user: userData } = res.data;
      localStorage.setItem('lms_token', jwtToken);
      localStorage.setItem('lms_user', JSON.stringify(userData));
      setToken(jwtToken);
      setUser(userData);
      return userData;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      const { token: jwtToken, user: newUser } = res.data;
      localStorage.setItem('lms_token', jwtToken);
      localStorage.setItem('lms_user', JSON.stringify(newUser));
      setToken(jwtToken);
      setUser(newUser);
      return newUser;
    }
  };

  const logout = () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('lms_user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isInstructor: user?.role === 'instructor',
    isStudent: user?.role === 'student',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
