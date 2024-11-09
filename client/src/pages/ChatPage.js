import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Connect to the server

function ChatPage({ userId1, userId2 }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Listen for initial messages and new incoming messages
    socket.on('initialMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Cleanup on component unmount
    return () => {
      socket.off('initialMessages');
      socket.off('receiveMessage');
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      senderId: userId1,
      receiverId: userId2,
      content: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    // Emit the message through the WebSocket
    socket.emit('sendMessage', messageData);
    setNewMessage('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '70vh', // Reduced height to move it lower on the screen
        p: 2,
        mt: 8, // Move the component lower on the page
        mx: 'auto', // Center the container horizontally
        width: '90%',
        maxWidth: '400px', // Limit the width for a compact display
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" component="h1" sx={{ mb: 1, textAlign: 'center', fontSize: '1rem' }}>
        Direct Message
      </Typography>

      {/* Messages display box */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          backgroundColor: '#ffffff',
          borderRadius: 1,
          p: 1,
          boxShadow: 1,
          mb: 1,
        }}
      >
        <List dense>
          {messages.map((message, index) => (
            <ListItem key={index} alignItems="flex-start" sx={{ mb: 0.5 }}>
              <ListItemText
                primary={
                  <Typography variant="subtitle2" color={message.senderId === userId1 ? 'primary' : 'secondary'} sx={{ fontSize: '0.85rem' }}>
                    {message.senderId === userId1 ? 'You' : 'Other'}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.75rem', mt: 0.25 }}>
                    {message.content}
                  </Typography>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ mb: 1 }} />

      {/* Message input box at the bottom */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          backgroundColor: '#ffffff',
          borderRadius: 1,
          boxShadow: 1,
          p: 1,
        }}
      >
        <TextField
          fullWidth
          label="Type a message"
          variant="outlined"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          sx={{
            flex: 1,
            fontSize: '0.85rem',
            '& .MuiInputBase-input': { fontSize: '0.85rem' },
            '& .MuiInputLabel-root': { fontSize: '0.75rem' },
          }}
        />
        <Button variant="contained" color="primary" onClick={handleSendMessage} sx={{ fontSize: '0.75rem', px: 2 }}>
          Send
        </Button>
      </Box>

      {error && (
        <Typography variant="body2" color="error" sx={{ mt: 1, fontSize: '0.75rem' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}

export default ChatPage;
