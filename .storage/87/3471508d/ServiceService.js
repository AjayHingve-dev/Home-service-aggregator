import axios from 'axios';

const API_URL = '/api/services';

class ServiceService {
  async getAllServices() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  }

  async getServiceById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      throw error;
    }
  }

  async createService(serviceData) {
    try {
      const response = await axios.post(API_URL, serviceData);
      return response.data;
    } catch (error) {
      console.error('Error creating service:', error);
      throw error;
    }
  }

  async updateService(id, serviceData) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, serviceData);
      return response.data;
    } catch (error) {
      console.error(`Error updating service with ID ${id}:`, error);
      throw error;
    }
  }

  async deleteService(id) {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting service with ID ${id}:`, error);
      throw error;
    }
  }

  async searchServices(query) {
    try {
      const response = await axios.get(`${API_URL}/search`, { params: { query } });
      return response.data;
    } catch (error) {
      console.error(`Error searching services with query "${query}":`, error);
      throw error;
    }
  }

  async getServicesByCategory(category) {
    try {
      const response = await axios.get(`${API_URL}/category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching services for category "${category}":`, error);
      throw error;
    }
  }
}

export default new ServiceService();