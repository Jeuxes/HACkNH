import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage'; // Assume this handles registration too.
import NavigationBarLoggedOut from './components/NavBar';

const App = () => {
  const [isRegistered, setIsRegistered] = useState(localStorage.getItem('isRegistered') === 'true');
  const [navBarHeight, setNavBarHeight] = useState(120);

  useEffect(() => {
    const navBar = document.querySelector('#navbar');
    if (navBar) {
      const height = navBar.offsetHeight;
      setNavBarHeight(height);
    }
  }, []);

  useEffect(() => {
    // Listen for changes in registration status if needed
    const handleStorageChange = () => {
      setIsRegistered(localStorage.getItem('isRegistered') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <div>
        {isRegistered && <NavigationBarLoggedOut navBarHeight={navBarHeight} />}
        <Routes>
          <Route path="/" element={isRegistered ? <HomePage /> : <Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to={isRegistered ? "/" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
