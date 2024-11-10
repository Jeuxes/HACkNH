import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NavigationBar from './components/NavBar';
import MapsPage from './pages/MapsPage';
import ChatPage from './pages/ChatPage';
import { io } from 'socket.io-client';

// Use environment variables for flexibility in production and development
export const PORT = process.env.REACT_APP_PORT;
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

let socket;

const App = () => {
  const [navBarHeight, setNavBarHeight] = useState(120);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canEnterChat, setCanEnterChat] = useState(false);

  const handleRegisterSuccess = (id) => {
    setUserId(id);
    setIsLoggedIn(true);
    initializeSocket(id);
  };

  const initializeSocket = (id) => {
    if (!socket) {
      socket = io(SOCKET_URL, {
        withCredentials: true,
      });

      console.log("Registering user", id);
      socket.emit('register', id);

      // Listen for a specific event to update state
      socket.on('specificString', () => {
        setCanEnterChat(true);
      });

      // Handle disconnect
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

    // Clean up WebSocket on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);

  return (
    <div>
      <NavigationBar navBarHeight={navBarHeight} isLoggedIn={isLoggedIn} canEnterChat={canEnterChat} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onRegisterSuccess={handleRegisterSuccess} />} />
        <Route path="/maps" element={userId ? <MapsPage userId={userId} /> : <Navigate to="/login" />} />
        <Route path="/chat" element={userId && canEnterChat ? <ChatPage socket={socket} userId={userId} /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
