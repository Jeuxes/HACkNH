import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box, Typography } from "@mui/material";
import "../styling/NavBar.css";

function NavigationBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollThreshold = 10; // Minimum scroll distance to trigger hiding/showing

  const pages = [
    { name: "WheresWildacat", path: "/" },
    { name: "map", path: "/map" },
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
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
          {pages.map((page, index) => (
            <Button
              key={page.name}
              component={Link}
              to={page.path}
              color="inherit"
              sx={{
                fontSize: page.name === "603Imports" ? '1.5rem' : '1rem',
                fontWeight: page.name === "603Imports" ? 'bold' : 'normal',
                textDecoration: 'none',
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
          }}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
