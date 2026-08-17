import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from '../utils/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(localStorage.getItem('user'));
      setUser(userData);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
  
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      setUser(user);
  
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const register = async (name, email, password, confirmPassword) => {
    setLoading(true);
    setError(null);
    try {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      await axios.post('/api/auth/register', { name, email, password });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, error, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);