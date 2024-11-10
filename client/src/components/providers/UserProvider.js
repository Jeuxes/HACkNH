import React, {createContext, useContext, useEffect, useState} from "react";
import {SocketContext} from "./SocketProvider";
import {socket} from "../../hooks/socket";

export const DEFAULT_COORDS = { lat: 43.1340, lng: -70.9264 };

export const UserContext = createContext();

export const UserProvider = ({children}) => {
  const socket = useContext(SocketContext);
  const [userId, setUserId] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [interestList, setInterestList] = useState([]);
  const [coordinates, setCoordinates] = useState(DEFAULT_COORDS);
  const [selectedLocation, setSelectedLocation] = useState(null);
  // const [userData, setuserData] = useState({});
  const [userMatchInterest, setMatchInterest] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [canEnterChat, setCanEnterChat] = useState(false);
  const [awaitingMatch, setAwaitingMatch] = useState(false);
  const [awaitingMatchResponse, setAwaitingMatchResponse] = useState(false);
  
  const registerUser = (id) => {
    setUserId(id);
    setIsLoggedIn(true);
    console.log('Activating user!');
  }
  
  const setUserMatch = (matchInterest) => {
    setUserMatch(matchInterest);
  }

  useEffect(() => {
    if (userMatchInterest) {
      console.log('bad init');
    }
    
    socket.on('specificString', () => {
      setCanEnterChat(true);
    });
    
    socket.on('partnerDisconnect', () => {
      setCanEnterChat(false);
    });
    
    socket.on('match', (commonInterests) => {
      console.log('Match received, stopping the interval.');
      console.log(commonInterests);
      setMatchInterest(commonInterests);
      setAwaitingMatch(false);
    })
  
    socket.on('disconnect', () => {
      console.log('disconnecting');
      setIsLoggedIn(false);
      setCanEnterChat(false);
    });
  });

  return (
    <UserContext.Provider value={{
      userId, setUserId,
      firstName, setFirstName,
      lastName, setLastName,
      interestList, setInterestList,
      isLoggedIn, setIsLoggedIn,
      selectedLocation, setSelectedLocation,
      coordinates, setCoordinates,
      canEnterChat, setCanEnterChat,
      userMatchInterest, setMatchInterest,
      awaitingMatch, setAwaitingMatch,
      awaitingMatchResponse, setAwaitingMatchResponse,
      registerUser
      }}>
      
      {children}
    </UserContext.Provider>
  );
}