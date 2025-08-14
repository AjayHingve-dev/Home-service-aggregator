import axios from 'axios';

const API_URL = '/api/service-requests';

class ServiceRequestService {
  async getAllServiceRequests() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching service requests:', error);
      throw error;
    }
  }

  async getServiceRequestById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service request with ID ${id}:`, error);
      throw error;
    }
  }

  async createServiceRequest(requestData) {
    try {
      const response = await axios.post(API_URL, requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating service request:', error);
      throw error;
    }
  }

  async updateServiceRequestStatus(id, status) {
    try {
      const response = await axios.put(`${API_URL}/${id}/status`, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating service request status for ID ${id}:`, error);
      throw error;
    }
  }

  async getUserServiceRequests() {
    try {
      const response = await axios.get(`${API_URL}/user`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user service requests:', error);
      throw error;
    }
  }

  async getProviderServiceRequests() {
    try {
      const response = await axios.get(`${API_URL}/provider`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider service requests:', error);
      throw error;
    }
  }
  
  async getProviderRequests() {
    try {
      const response = await axios.get(`${API_URL}/provider`);
      return response.data;
    } catch (error) {
      console.error('Error fetching provider requests:', error);
      throw error;
    }
  }

  async cancelServiceRequest(id, reason) {
    try {
      const response = await axios.put(`${API_URL}/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error canceling service request with ID ${id}:`, error);
      throw error;
    }
  }

  async completeServiceRequest(id) {
    try {
      const response = await axios.put(`${API_URL}/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Error completing service request with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new ServiceRequestService();