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
      if (token) {
          // Optional: You could verify token validity with an API call here
          // For now, we assume if token exists, user is logged in
          // You might want to decode the token to get the user name if stored there
          setUser({ name: 'User', role: 'user' }); 
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  // LOGIN FUNCTION
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password });
      
      // If successful, save token and user data
      localStorage.setItem('token', data.token);
      setUser(data); // Backend returns { _id, name, email, role, token }
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
        localStorage.setItem('token', data.token);
        setUser(data);
        router.push('/dashboard');
        toast.success("Account created successfully! 🎉");
    
    } catch (error) {
        console.error("Registration failed", error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};