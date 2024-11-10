// import React, {useContext, useEffect, createContext, useState} from "react";
// import { socket, connectSocket, disconnectSocket, sendBroadcastMessage } from "../../hooks/socket";
// // import console from "console-browserify";
// import {UserContext} from "./UserProvider";
//
// export const SocketContext = createContext();
//
// const SocketProvider = ({children}) => {
//   const user = useContext(UserContext);
//
//   const assignId = async (id) => {
//     console.log("Registering user", id);
//     socket.emit('register', id);
//   }
//
//   useEffect(() => {
//     connectSocket();
//     sendBroadcastMessage('connect');
//
//     socket.on('connect', () => {
//       console.log('Connected to socket server');
//     });
//
//     socket.on('specificString', () => {
//       user.setCanEnterChat(true);
//     });
//
//     socket.on('disconnect', () => {
//       user.setCanEnterChat(false);
//       console.log('Disconnected from socket server');
//     });
//
//     return () => {
//       disconnectSocket();
//       sendBroadcastMessage('disconnect');
//       // socket.on('connect');
//       // socket.off('disconnect');
//     }
//   }, []);
//
//   // "match", (matchedUserName, commonInterestList) => {}
//
//   return (
//     <SocketContext.Provider value={{socket, canEnterChat, assignId}}>
//       {children}
//     </SocketContext.Provider>
//   );
// }
//
// export default SocketProvider;