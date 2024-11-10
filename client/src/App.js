import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NavigationBar from './components/NavBar';
import MapsPage from './pages/MapsPage';
import ChatPage from './pages/ChatPage';
import { io } from 'socket.io-client';

export const PORT = 6969;
export const API_BASE_URL = `http://localhost:${PORT}`;
let socket;

const App = () => {
  const [navBarHeight, setNavBarHeight] = useState(120);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const [canEnterChat, setCanEnterChat] = useState(false); // New state for chat entry condition

  const handleRegisterSuccess = (id) => {
    setUserId(id);
    setIsLoggedIn(true); // Set login status to true upon successful registration
    initializeSocket(id);
  };

  const initializeSocket = (id) => {
    if (!socket) {
      socket = io(`http://localhost:${PORT}`);
      console.log("registering user", id);
      socket.emit('register', id);

      socket.on('specificString', () => {
        setCanEnterChat(true); // Enable chat access upon receiving specific string
      });

      socket.on('disconnect', () => {
        setCanEnterChat(false);
      });
    }
  };

  useEffect(() => {
    const navBar = document.querySelector('#navbar');
    if (navBar) {
      setNavBarHeight(navBar.offsetHeight);
    }
  }, []);

  return (
    <div>
      <NavigationBar navBarHeight={navBarHeight} isLoggedIn={isLoggedIn} canEnterChat={canEnterChat} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onRegisterSuccess={handleRegisterSuccess} />} />
        <Route path="/maps" element={<MapsPage />} />
        <Route path="/chat" element={<ChatPage socket={socket} userId={userId} />} />
      </Routes>
    </div>
  );
};

export default App;
