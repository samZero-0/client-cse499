'use client';
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAxios from '@/hooks/useAxios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

const storeUser = (user) => localStorage.setItem('user', JSON.stringify(user));

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const axios = useAxios();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        setLoading(false);
        return;
      }

      // Show the stored user instantly, then refresh from the server below
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setLoading(false);
        } catch (err) {
          console.error('Failed to parse stored user', err);
        }
      }

      try {
        const { data } = await axios.get('/users/profile');
        setUser(data);
        storeUser(data);
      } catch (err) {
        // Expired or invalid token: sign out locally
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const startSession = (data) => {
    const { token, ...userData } = data;
    if (token) localStorage.setItem('token', token);
    storeUser(userData);
    setUser(userData);
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      startSession(data);
      router.push('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const { data } = await axios.post('/auth/register', { name, email, password });
      startSession(data);
      router.push('/dashboard');
      toast.success('Account created. Welcome to PantryPal.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  // Save profile changes to the server and keep the local session in sync
  const updateUser = async (changes) => {
    const { data } = await axios.put('/users/profile', changes);
    const { token, ...userData } = data;
    storeUser(userData);
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
