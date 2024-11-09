import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import "../styling/NavBar.css";

function NavigationBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollThreshold = 10; // Minimum scroll distance to trigger hiding/showing

  const pages = [
    { name: "Map", path: "/maps" },
    { name: "Chat", path: "/chat" }
  ];

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    // Prevent hiding at the top of the page
    if (currentScrollY <= 0) {
      setVisible(true);
    } else if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
      setVisible(currentScrollY < lastScrollY); // Show on scroll up, hide on scroll down
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <AppBar
      position="fixed"
      className={`NavBar ${visible ? '' : 'NavBar-hidden'}`}
      sx={{ backgroundColor: 'white', color: 'black' }}
    >
      <Toolbar className="toolbar">
        {/* Navigation Links */}
        <Box className="nav-links" sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Clickable Wildcat image linked to home page */}
          <Link to="/">
            <img
              src="/images/wildcat.png"
              alt="Wildcat Logo"
              style={{
                width: '50px',
                height: '50px',
                marginRight: '8px',
                cursor: 'pointer'  // Ensure it looks clickable
              }}
            />
          </Link>
          {pages.map((page) => (
            <Button
              key={page.name}
              component={Link}
              to={page.path}
              color="inherit"
              sx={{
                fontSize: '1rem',
                fontWeight: 'normal',
                textDecoration: 'none',
                marginLeft: '20px'  // Added for spacing between image and buttons
              }}
            >
              {page.name}
            </Button>
          ))}
        </Box>
        {/* Login Button */}
        <Button
          component={Link}
          to="/login"
          color="inherit"
          sx={{
            textDecoration: 'none',
            fontSize: '1rem',
            marginLeft: 'auto'  // This pushes the login button to the right
          }}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
