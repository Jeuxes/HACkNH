export const api = {
  signup: async (userData) => {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Signup failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  login: async (userData) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  checkHealth: async () => {
    try {
      const response = await fetch('/api/health');
      if (!response.ok) {
        throw new Error('Failed to fetch health status');
      }
      const data = await response.json();
      return data.status;
    } catch (error) {
      console.error('Error fetching health status:', error);
      throw error;
    }
  },

  getListings: async () => {
    try {
      const response = await fetch('/api/listings');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch listings');
      }

      return await response.json(); // Assuming it returns an array of listings
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw error;
    }
  }
};
