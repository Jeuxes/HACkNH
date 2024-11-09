import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NavigationBarLoggedOut from './components/NavBar.js';
import MapsPage from './pages/MapsPage.js';
import ChatPage from './pages/ChatPage.js';
const App = () => {
  const [navBarHeight, setNavBarHeight] = useState(120);
  const [data, setData] = useState(null);

  // Get the height of the navbar when the component mounts
  useEffect(() => {
    const navBar = document.querySelector('#navbar');
    if (navBar) {
      const height = navBar.offsetHeight;
      setNavBarHeight(height);
    }
  }, []);

  return (
    <div>
      <Router>
        <NavigationBarLoggedOut navBarHeight={navBarHeight} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/maps" element={<MapsPage />} />
          <Route path="/chat" element={<ChatPage />} />


          
        </Routes>
      </Router>

      {/* Render the fetched data */}
      {data && (
        <div>
          <p>Message from Flask: {data.message}</p>
          <p>Status: {data.status}</p>
        </div>
      )}
    </div>
  );
};

export default App;
