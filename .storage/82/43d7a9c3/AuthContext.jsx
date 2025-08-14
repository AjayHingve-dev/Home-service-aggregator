import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import AuthService from '../services/AuthService';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expired, logout
            logout();
          } else {
            // Token valid
            const userProfile = await AuthService.getCurrentUser();
            setCurrentUser(userProfile);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error("Error initializing auth:", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);
      const { accessToken, user } = response;
      
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setCurrentUser(user);
      setIsAuthenticated(true);
      
      return { success: true, user };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Login failed. Please check your credentials." 
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);
      return { success: true, message: response.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || "Registration failed. Please try again." 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    AuthService.logout();
  };

  const hasRole = (requiredRoles) => {
    if (!currentUser || !currentUser.roles) return false;
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return isAuthenticated;
    }
    
    return currentUser.roles.some(role => requiredRoles.includes(role));
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};