// import React, {createContext, useEffect, useState} from "react";
// import {SocketContext} from "./SocketProvider";
//
// export const UserContext = createContext();
//
// const UserProvider = ({children}) => {
//   const [userId, setUserId] = useState(null);
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [canEnterChat, setCanEnterChat] = useState(false);
//
//   // useEffect(() => {
//   //
//   // });
//
//   const registerId = (id) => {
//     setUserId(id);
//   }
//
//   return (
//     <UserContext.Provider value={{userId, firstName, lastName, isLoggedIn, setUserId, canEnterChat, setCanEnterChat}}>
//       {children}
//     </UserContext.Provider>
//   );
// }