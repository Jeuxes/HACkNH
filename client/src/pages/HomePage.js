import React, { useState } from "react";
import {
  Typography,
  Container,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login'; // Icon for the login/sign up button
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'; // Icon for the health check button
import { api } from "../services/apiController";
import "../styling/HomePage.css";

function HomePage() {
  const [healthStatus, setHealthStatus] = useState("");

  const checkHealth = async () => {
    try {
      const status = await api.checkHealth();
      setHealthStatus(status);
    } catch (error) {
      console.error("Error fetching health status:", error);
      setHealthStatus("Error fetching health status");
    }
  };

  const features = [
    {
      title: "Interactive Maps",
      description: "Explore our interactive maps that help you navigate with ease.",
      image: "/images/feature1.jpeg"  // Ensure the image path is correct
    },
    {
      title: "Real-time Chat",
      description: "Connect instantly with real-time chat for all your communication needs.",
      image: "/images/feature2.jpg"
    },
    {
      title: "User Profiles",
      description: "Create and customize your user profile to engage with the community.",
      image: "/images/profile_feature.png"
    },
    {
      title: "24/7 Support",
      description: "Get support anytime with our 24/7 dedicated help center.",
      image: "/images/support_feature.png"
    }
  ];
  

   return (
    <Container>
      <Box className="box-1">
        <Box className="box-3">
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to Where's Wildcat
          </Typography>
          <Box className="button-box" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}>
            <Button
              className="button-1"
              variant="contained"
              color="primary"
              size="large"
              href="/signup"
              startIcon={<LoginIcon />}
            >
              Sign Up Now
            </Button>
            <Button
              className="button-2"
              variant="outlined"
              color="secondary"
              size="large"
              onClick={checkHealth}
              startIcon={<HealthAndSafetyIcon />}
            >
              Check Server Health
            </Button>
          </Box>
          {healthStatus && (
            <Typography
              variant="body1"
              className="health-status"
              sx={{ mt: 4 }}
            >
              Server Health Status: {healthStatus}
            </Typography>
          )}
        </Box>
      </Box>

      <Container maxWidth="md" className="features-section" sx={{ mt: 8 }}>
      <Grid container spacing={4}>
  {features.map((feature, index) => (
    <Grid item xs={12} sm={6} md={6} key={index}> 
      <Card className="feature-card" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <CardMedia
          component="img"
          sx={{ width: 300, height: 200 }} // Adjust dimensions to fit your design needs
          image={feature.image}
          alt={feature.title}
        />
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {feature.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {feature.description}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
      </Container>
    </Container>
  );
}

export default HomePage;