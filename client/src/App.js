import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NavigationBar from './components/NavBar';
import MapsPage from './pages/MapsPage';
import ChatPage from './pages/ChatPage';
import { io } from 'socket.io-client';

// Use environment variables for flexibility in production and development
export const PORT = 6969;
export const API_BASE_URL = `http://3.91.144.23:6969`;

let socket = io('ws://3.91.144.23:6969', {withCredentials: true});

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
    if (socket) {

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

  const testConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/`, { method: 'GET' });
      const data = await response.text();
      console.log('Server response:', data);
    } catch (error) {
      console.error('Error connecting to server:', error);
    }
  };


  useEffect(() => {
    const navBar = document.querySelector('#navbar');
    if (navBar) {
      setNavBarHeight(navBar.offsetHeight);
    }

    testConnection();

    // Clean up WebSocket on unmount
    return () => {
      if (socket) {
        console.log(`User ${socket.id}: disconnecting`);
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
