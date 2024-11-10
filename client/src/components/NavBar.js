import React, {useState, useEffect, useContext} from "react";
import {Text} from "react-native";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import "../styling/NavBar.css";
import {UserContext} from "./providers/UserProvider";

const NavigationBar = () => { // Receive isLoggedIn as a prop
  const user = useContext(UserContext);
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollThreshold = 10;

  const pages = [
    { name: "Map", path: "/maps", visible: user.isLoggedIn }, // Show only if logged in
    { name: "Chat", path: "/chat", visible: user.canEnterChat } // Show only if canEnterChat is true
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
        {(user.firstName) && (
          <Text>
            Hello "{user.firstName}"
          </Text>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default NavigationBar;
