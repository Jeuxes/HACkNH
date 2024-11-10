import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useLocation } from 'react-router-dom';

function ChatPage({ socket, userId }) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (socket && userId) {
      console.log("registering user in ChatPage", userId);
      socket.emit('register', userId);

      socket.on('initialMessages', (initialMessages) => {
        setMessages(initialMessages);
      });

      socket.on('newMessage', (messageData) => {
        const parsedMessage = {
          name: messageData.name,
          content: messageData.content,
        };
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      });

      setIsConnected(true);

      return () => {
        socket.off('initialMessages');
        socket.off('newMessage');
        socket.disconnect();
      };
    }
  }, [socket, userId]);

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      name: 'You',
      content: newMessage.trim(),
    };

    socket.emit('sendMessage', messageData);
    setNewMessage('');
    setMessages((prevMessages) => [...prevMessages, messageData]);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '70vh',
        p: 2,
        mt: 8,
        mx: 'auto',
        width: '90%',
        maxWidth: '400px',
        backgroundColor: '#f5f5f5',
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h6" component="h1" sx={{ mb: 1, textAlign: 'center', fontSize: '1rem' }}>
        Direct Message
      </Typography>

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
                  <Typography variant="subtitle2" color={message.name === 'You' ? 'primary' : 'secondary'} sx={{ fontSize: '0.85rem' }}>
                    {message.name}
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
