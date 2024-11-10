import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NavigationBar from './components/NavBar';
import MapsPage from './pages/MapsPage';
import ChatPage from './pages/ChatPage';
import { io } from 'socket.io-client';

// Use the server's IP for API and WebSocket URLs
export const API_BASE_URL = 'http://3.91.144.23:6969';
export const SOCKET_URL = 'wss://3.91.144.23:6969'; // WebSocket URL for the backend

const App = () => {
  const [navBarHeight, setNavBarHeight] = useState(120);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canEnterChat, setCanEnterChat] = useState(false);
  const [socket, setSocket] = useState(null);  // Using state to store the socket instance

  // Handle register success to set userId and establish WebSocket connection
  const handleRegisterSuccess = (id) => {
    setUserId(id);
    setIsLoggedIn(true);
    initializeSocket(id);
  };

  // Initialize socket connection
  const initializeSocket = (id) => {
    if (!socket) {
      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
      });

      setSocket(newSocket);  // Store the new socket instance in state

      console.log("Registering user", id);
      newSocket.emit('register', id);

      // Listen for a specific event to update state
      newSocket.on('specificString', () => {
        setCanEnterChat(true);
      });

      // Handle disconnect event
      newSocket.on('disconnect', () => {
        setCanEnterChat(false);
      });
    }
  };

  // Effect for setting navbar height and cleaning up the socket connection
  useEffect(() => {
    const navBar = document.querySelector('#navbar');
    if (navBar) {
      setNavBarHeight(navBar.offsetHeight);
    }

    // Clean up WebSocket connection on unmount
    return () => {
      if (socket) {
        console.log(`User ${socket.id}: disconnecting`);
        socket.disconnect();
        setSocket(null);  // Clear the socket state
      }
    };
  }, [socket]);  // Re-run this effect if `socket` state changes

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
