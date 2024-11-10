import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import "../styling/NavBar.css";

function NavigationBar({ isLoggedIn, canEnterChat }) { // Receive isLoggedIn as a prop
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollThreshold = 10;

  const pages = [
    { name: "Map", path: "/maps", visible: isLoggedIn }, // Show only if logged in
    { name: "Chat", path: "/chat", visible: canEnterChat } // Show only if canEnterChat is true
  ];

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY <= 0) {
      setVisible(true);
    } else if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
      setVisible(currentScrollY < lastScrollY);
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
        <Box className="nav-links" sx={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/">
            <img
              src="/images/wildcat.png"
              alt="Wildcat Logo"
              style={{
                width: '50px',
                height: '50px',
                marginRight: '8px',
                cursor: 'pointer'
              }}
            />
          </Link>
          {pages.map(
            (page) =>
              page.visible && ( // Check visibility based on isLoggedIn and canEnterChat
                <Button
                  key={page.name}
                  component={Link}
                  to={page.path}
                  color="inherit"
                  sx={{
                    fontSize: '1rem',
                    fontWeight: 'normal',
                    textDecoration: 'none',
                    marginLeft: '20px'
                  }}
                >
                  {page.name}
                </Button>
              )
          )}
        </Box>
        <Button
          component={Link}
          to="/login"
          color="inherit"
          sx={{
            textDecoration: 'none',
            fontSize: '1rem',
            marginLeft: 'auto'
          }}
        >
          Login
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
