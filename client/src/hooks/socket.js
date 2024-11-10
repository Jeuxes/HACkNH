import { createContext  } from 'react';
import io from 'socket.io-client';
// import { BroadcastChannel } from 'broadcast-channel';

export const PORT = 6969;
const ADDRESS = 'whereswildcat.com';
export const API_BASE_URL = `https://whereswildcat.com/user`;
export const SOCKET_URL = `wss://${ADDRESS}:${PORT}`; // Ensure WebSocket protocol
export const socket = io(SOCKET_URL, {withCredentials: true});

// const PORT = 6969;
// const ADDRESS = 'localhost'
// export const API_BASE_URL = `http://${ADDRESS}:${PORT}`;
// export const SOCKET_URL = `ws://${ADDRESS}:${PORT}`; // Ensure WebSocket protocol
// export const socket = io(SOCKET_URL, {transports: ["websocket"], withCredentials: true, autoConnect: true});

// const broadcastChannel = new BroadcastChannel('socketConnectionChannel');

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

// broadcastChannel.onmessage = (event) => {
//   if (event.data === 'connect') {
//     connectSocket();
//   } else if (event.data === 'disconnect') {
//     disconnectSocket();
//   }
// };
//
// export const sendBroadcastMessage = (message) => {
//   broadcastChannel.postMessage(message);
// }