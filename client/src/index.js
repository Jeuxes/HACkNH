// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import SocketProvider from "./components/providers/SocketProvider";
import {UserProvider} from "./components/providers/UserProvider";

ReactDOM.render(
  <BrowserRouter>
    <SocketProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </SocketProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
