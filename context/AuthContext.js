'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  // Check if user is logged in
  const checkUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/auth/verify', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Error checking user:', error);
      localStorage.removeItem('token');
      setUser(null);
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        router.push('/dashboard');
        return { success: true };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

  const register = async (userData) => {
    if(userData.password.length<6){
      return { success: false, error: 'Password must be at least 6 characters long' };
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await res.json();

      if (data.success) {
        // After successful registration, log the user in
        return await login(userData.email, userData.password);
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'An error occurred during registration' };
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      // Call logout API to clear server-side session
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API fails, clear local state
      localStorage.removeItem('token');
      setUser(null);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
