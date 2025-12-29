'use client';
import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAxios from '@/hooks/useAxios';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const axios = useAxios();

  useEffect(() => {
    // Check if user is logged in on page load
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        setLoading(false);
        return;
      }

      // If we have stored user data, prefer that for instant hydration
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          setLoading(false);
          return;
        } catch (err) {
          console.error('Failed to parse stored user', err);
        }
      }

      // Fallback: try to fetch the current user profile
      try {
        const { data } = await axios.get('/auth/me');
        setUser(data);
        localStorage.setItem('user', JSON.stringify(data));
      } catch (err) {
        console.error('Failed to fetch user profile', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      
      // If successful, save token and user data
      const userData = data.user ?? data;
      const token = data.token ?? userData.token;
      if (token) localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      router.push('/dashboard');
    
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  // REGISTER FUNCTION
  const register = async (userData) => {
    try {
        const { data } = await axios.post('/auth/register', userData);
        
        // If successful, save token and user data
        const newUser = data.user ?? data;
        const token = data.token ?? newUser.token;
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
        router.push('/dashboard');
        toast.success("Account created successfully! 🎉");
    
    } catch (error) {
        console.error("Registration failed", error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};