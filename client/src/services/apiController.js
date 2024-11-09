export const api = {
  register: async (userData) => {
    try {
      const response = await fetch('/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Registration failed");
        throw new Error(errorData.message || 'Registration failed');
      }

      const { userId } = await response.json(); // Expect userId in the response
      return userId;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
};
