import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiController';

function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send
    const userData = {
      email: email.trim(),
      password: password,
    };

    try {
      // Use the login API from apiController
      const data = await api.login(userData);
      console.log('Login successful:', data);
      navigate('/');
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 12, mb: 4 }}>
      <Box
        sx={{
          p: 4,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            sx={{ mt: 2 }}
          >
            Login
          </Button>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Don't have an account? <a href="/signup">Sign Up</a>
        </Typography>
      </Box>
    </Container>
  );
}

export default LoginPage;
