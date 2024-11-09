import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography, FormControlLabel, Checkbox, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/apiController';

function LoginPage() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [interests, setInterests] = useState([]); // Set interests as an array

  const interestOptions = {
    music: [
      { name: 'Pop Music' },
      { name: 'Rock Music' },
      { name: 'Hip-Hop/Rap Music' },
      { name: 'EDM' },
      { name: 'Classical Music' },
      { name: 'Indie/Alternative Music' },
    ],
    academic: [
      { name: 'Science' },
      { name: 'Literature' },
      { name: 'History' },
      { name: 'Politics/Current Affairs' },
      { name: 'Philosophy' },
      { name: 'Technology & Innovation' },
      { name: 'Business/Entrepreneurship' },
      { name: 'Environmental Issues' },
    ],
    lifestyle: [
      { name: 'Fitness' },
      { name: 'Socializing' },
      { name: 'Mental Health' },
      { name: 'Gaming' },
      { name: 'Streaming/Watching TV' },
      { name: 'Travel' },
      { name: 'Food' },
      { name: 'Volunteer/Community Service' },
    ],
    other: [
      { name: 'Art' },
      { name: 'Music Production' },
      { name: 'DIY Projects' },
      { name: 'Sports' },
    ],
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit called");

    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      interests, // Now interests is an array of selected interest names
    };

    console.log("userData:", userData);

    try {
      const userId = await api.register(userData);
      console.log('Registration successful with userId:', userId);
      navigate(`/chat/${userId}`);
    } catch (error) {
      console.log('Error during registration:', error);
      setError(error.message);
    }
  };

  const handleInterestChange = (name) => (e) => {
    setInterests((prevInterests) =>
      e.target.checked
        ? [...prevInterests, name] // Add the selected interest
        : prevInterests.filter((interest) => interest !== name) // Remove if unchecked
    );
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
          Register
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

          {Object.keys(interestOptions).map((category) => (
            <Box key={category} sx={{ mt: 2 }}>
              <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
                {category.charAt(0).toUpperCase() + category.slice(1)} Interests
              </Typography>
              <Grid container spacing={1}>
                {interestOptions[category].map((interest) => (
                  <Grid item xs={6} key={interest.name}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={interests.includes(interest.name)}
                          onChange={handleInterestChange(interest.name)}
                          name={interest.name}
                        />
                      }
                      label={interest.name}
                    />
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}

          <Button
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            sx={{ mt: 2 }}
          >
            Register
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
