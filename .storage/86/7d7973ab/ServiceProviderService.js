import axios from 'axios';

const API_URL = '/api/service-providers';

class ServiceProviderService {
  async getAllServiceProviders() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching service providers:', error);
      throw error;
    }
  }

  async getServiceProviderById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service provider with ID ${id}:`, error);
      throw error;
    }
  }

  async registerAsServiceProvider(providerData) {
    try {
      const response = await axios.post(API_URL, providerData);
      return response.data;
    } catch (error) {
      console.error('Error registering as service provider:', error);
      throw error;
    }
  }

  async updateServiceProvider(id, providerData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, providerData);
      return response.data;
    } catch (error) {
      console.error(`Error updating service provider with ID ${id}:`, error);
      throw error;
    }
  }

  async getProviderDashboardData() {
    try {
      const response = await axios.get(`${API_URL}/dashboard`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider dashboard data:', error);
      throw error;
    }
  }
}

export default new ServiceProviderService();