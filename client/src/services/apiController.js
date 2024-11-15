// api.js
import { API_BASE_URL } from '../App';

export const api = {
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Registration failed");
        throw new Error(errorData.message || 'Registration failed');
      }

      const { userId } = await response.json();
      return userId;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  setVenue: async (venueData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/setVenue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venueData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Failed to set venue");
        throw new Error(errorData.message || 'Setting venue failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error setting venue:', error);
      throw error;
    }
  },
};
