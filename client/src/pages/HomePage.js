import React from "react";
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
import LoginIcon from '@mui/icons-material/Login';
import "../styling/HomePage.css";

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

function HomePage() {
  return (
    <Container>
      {/* Top Section */}
      <Box className="welcome-section">
        <Typography variant="h2" component="h1" className="welcome-message" gutterBottom>
          Welcome to Where's Wildcat
        </Typography>
        
        <Box
          className="button-box"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4 }}
        >
          <Button
            className="button-1"
            variant="contained"
            color="primary"
            size="large"
            href="/login" // Update to route to the sign-in page
            startIcon={<LoginIcon />}
          >
            Sign In
          </Button>
        </Box>
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
                  alt={feature.title || "Feature Image"}
                />
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {feature.title || "Feature"}
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
