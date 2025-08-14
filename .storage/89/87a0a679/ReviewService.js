import axios from 'axios';

const API_URL = '/api/reviews';

class ReviewService {
  async getReviewsForProvider(providerId) {
    try {
      const response = await axios.get(`${API_URL}/provider/${providerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for provider ID ${providerId}:`, error);
      throw error;
    }
  }

  async getReviewsForService(serviceId) {
    try {
      const response = await axios.get(`${API_URL}/service/${serviceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching reviews for service ID ${serviceId}:`, error);
      throw error;
    }
  }

  async submitReview(reviewData) {
    try {
      const response = await axios.post(API_URL, reviewData);
      return response.data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  async getUserReviews() {
    try {
      const response = await axios.get(`${API_URL}/user`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  }

  async updateReview(reviewId, reviewData) {
    try {
      const response = await axios.put(`${API_URL}/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Error updating review with ID ${reviewId}:`, error);
      throw error;
    }
  }

  async deleteReview(reviewId) {
    try {
      const response = await axios.delete(`${API_URL}/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting review with ID ${reviewId}:`, error);
      throw error;
    }
  }
}

export default new ReviewService();