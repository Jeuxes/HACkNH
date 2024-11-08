import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiController'; // Import the apiController

function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [surveyID, setSurveyID] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Prepare data to send
    const userData = {
      email: email.trim(),
      password: password,
      surveyID: surveyID.trim(),
    };

    try {
      // Use the signup API from apiController
      const data = await api.signup(userData);
      console.log('Signup successful:', data);
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
          Sign Up
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
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <TextField
            label="Qualtrics Survey ID (Optional)"
            variant="outlined"
            fullWidth
            value={surveyID}
            onChange={(e) => setSurveyID(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            sx={{ mt: 2 }}
          >
            Sign Up
          </Button>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <a href="/login">Login</a>
        </Typography>
      </Box>
    </Container>
  );
}

export default SignupPage;
