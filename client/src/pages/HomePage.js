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
      description: "Meet other Wildcats With Similar Interests!",
      image: "/images/feature2.jpg"
    },
    {
      description: "Discover Popular Wildcat Locations!!",
      image: "/images/feature1.jpeg"
    },
    {
      title: "Feature 3",
      description: "Description of Feature 3",
      image: "/path-to-image-3.jpg"
    },
    {
      title: "Feature 4",
      description: "Description of Feature 4",
      image: "/path-to-image-4.jpg"
    }
  ];

  return (
    <Container>
      {/* Top Section */}
      <Box className="welcome-section">
        <Typography variant="h2" component="h1" className="welcome-message" gutterBottom>
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

      {/* Bottom Section - Features */}
      <Container maxWidth="md" className="features-section">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card className="feature-card">
                <CardMedia
                  className="feature-image"
                  component="img"
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
