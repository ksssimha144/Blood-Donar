import { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../constants';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Restore session from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('v_user');
    const storedToken = localStorage.getItem('v_token');

    if (storedUser && storedToken) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // 2. Session Healing: Sync donor status if missing from current logged-in user
  useEffect(() => {
    const syncDonorStatus = async () => {
      // Trigger sync if we have a session but don't know the isDonor status yet
      if (isAuthenticated && token && user && user.isDonor === undefined) {
        try {
          const response = await fetch(`${API_BASE_URL}/donors/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.success) {
            setIsDonor(data.isDonor);
          }
        } catch (error) {
          console.error('Role sync failed:', error);
        }
      }
    };

    syncDonorStatus();
  }, [isAuthenticated, token, user]);

  // Register User
  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Save to localStorage
      const userData = { name: data.name, email: data.email, isDonor: data.isDonor };
      localStorage.setItem('v_user', JSON.stringify(userData));
      localStorage.setItem('v_token', data.token);

      // Update State
      setUser(userData);
      setToken(data.token);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Login User
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Save to localStorage
      const userData = { name: data.name, email: data.email, isDonor: data.isDonor };
      localStorage.setItem('v_user', JSON.stringify(userData));
      localStorage.setItem('v_token', data.token);

      // Update State
      setUser(userData);
      setToken(data.token);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Logout User
  const logout = () => {
    localStorage.removeItem('v_user');
    localStorage.removeItem('v_token');
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
  };

  // Update Donor Status (Real-time)
  const setIsDonor = (status) => {
    setUser(prev => {
      const updated = { ...prev, isDonor: status };
      localStorage.setItem('v_user', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      loading, 
      login, 
      register, 
      logout,
      setIsDonor
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
