import axios from 'axios';

const API_URL = '/api/auth';

class AuthService {
  async login(credentials) {
    const response = await axios.post(`${API_URL}/signin`, credentials);
    return response.data;
  }

  async register(userData) {
    const response = await axios.post(`${API_URL}/signup`, userData);
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
  }

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    try {
      const response = await axios.get('/api/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  checkAuthentication() {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
    return !!token;
  }
}

// Create axios interceptor to handle token
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Handle 401 responses globally
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default new AuthService();