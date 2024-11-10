import React, {useState, useEffect, useContext} from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NavigationBar from './components/NavBar';
import MapsPage from './pages/MapsPage';
import ChatPage from './pages/ChatPage';
import { io } from 'socket.io-client';
import {UserContext} from "./components/providers/UserProvider";
import {SocketContext} from "./components/providers/SocketProvider";

// Use environment variables for flexibility in production and development
// export const PORT = 6969;
// const ADDRESS = 'localhost';
// export const API_BASE_URL = `http://${ADDRESS}:${PORT}`;
// export const SOCKET_URL = `ws://${ADDRESS}:${PORT}`; // Ensure WebSocket protocol
//
// let socket = io(SOCKET_URL, {withCredentials: true});

const App = () => {
  const socket = useContext(SocketContext);
  const user = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [navBarHeight, setNavBarHeight] = useState(120);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canEnterChat, setCanEnterChat] = useState(false);

  const handleRegisterSuccess = (id) => {
    user.setIsLoggedIn(true);
    user.setUserId(id);
    initializeSocket(id);
  };

  const initializeSocket = (id) => {
    console.log("Registering user", id);
    socket.emit('register', id, (response) => {
      console.log(`'resgister' response:`);
      console.log(response.userData);
      user.setFirstName(response.userData.firstname);
      user.setLastName(response.userData.lastname);
    });
  };

  useEffect(() => {
    const navBar = document.querySelector('#navbar');
    if (navBar) {
      setNavBarHeight(navBar.offsetHeight);
    }

    // Clean up WebSocket on unmount
    return () => {
      if (socket) {
        console.log(`User ${socket.id}: disconnecting`);
        socket.disconnect();
        // socket = null;
      }
    };
  }, []);

  return (
    <div>
      <NavigationBar navBarHeight={navBarHeight} isLoggedIn={user.isLoggedIn} canEnterChat={user.canEnterChat} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onRegisterSuccess={handleRegisterSuccess} />} />
        <Route path="/maps" element={user.userId ? <MapsPage /> : <Navigate to="/login" />} />
        <Route path="/chat" element={user.userId && user.canEnterChat ? <ChatPage userId={user.userId} /> : <Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
