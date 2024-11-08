import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, FormControlLabel, Checkbox, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiController';

function LoginPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [interests, setInterests] = useState({
    football: false,
    hockey: false,
    tennis: false,
    rockClimbing: false,
    basketball: false,
    reading: false,
    traveling: false,
    cooking: false,
    hiking: false,
    photography: false,
    music: false,
    painting: false,
    gardening: false,
    gaming: false,
    yoga: false,
    coding: false,
    fishing: false,
    dancing: false,
    cycling: false,
    swimming: false,
  });

  const interestOptions = [
    { name: 'football', label: 'Football' },
    { name: 'hockey', label: 'Hockey' },
    { name: 'tennis', label: 'Tennis' },
    { name: 'rockClimbing', label: 'Rock Climbing' },
    { name: 'basketball', label: 'Basketball' },
    { name: 'reading', label: 'Reading' },
    { name: 'traveling', label: 'Traveling' },
    { name: 'cooking', label: 'Cooking' },
    { name: 'hiking', label: 'Hiking' },
    { name: 'photography', label: 'Photography' },
    { name: 'music', label: 'Music' },
    { name: 'painting', label: 'Painting' },
    { name: 'gardening', label: 'Gardening' },
    { name: 'gaming', label: 'Gaming' },
    { name: 'yoga', label: 'Yoga' },
    { name: 'coding', label: 'Coding' },
    { name: 'fishing', label: 'Fishing' },
    { name: 'dancing', label: 'Dancing' },
    { name: 'cycling', label: 'Cycling' },
    { name: 'swimming', label: 'Swimming' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      interests: Object.keys(interests).filter((key) => interests[key]),
    };

    try {
      const data = await api.register(userData);
      console.log('Registration successful:', data);
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handleInterestChange = (e) => {
    setInterests({ ...interests, [e.target.name]: e.target.checked });
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 4 }}>
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
          Log on
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
          noValidate
          autoComplete="off"
        >
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Typography variant="h6" component="h2" sx={{ mt: 2, mb: 1 }}>
            Interests
          </Typography>
          <Grid container spacing={1}>
            {interestOptions.map((interest) => (
              <Grid item xs={6} key={interest.name}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={interests[interest.name]}
                      onChange={handleInterestChange}
                      name={interest.name}
                    />
                  }
                  label={interest.label}
                />
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            sx={{ mt: 2 }}
          >
            Log in
          </Button>
          {error && (
            <Typography variant="body2" color="error" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default LoginPage;
