import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Divider, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

let socket;

function ChatPage() {
  const { userId } = useParams(); // Retrieve userId from route parameters
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isConnected && userId) {
      // Initialize the socket connection
      socket = io('http://localhost:6969');
      
      // Register the user with the server using userId
      socket.emit('register', userId);

      // Listen for initial messages from the server
      socket.on('initialMessages', (initialMessages) => {
        setMessages(initialMessages);
      });

      // Listen for new incoming messages from the server as JSON objects
      socket.on('newMessage', (messageData) => {
        // Assuming messageData is a JSON object with 'name' and 'content'
        const parsedMessage = {
          name: messageData.name,
          content: messageData.content,
        };
        setMessages((prevMessages) => [...prevMessages, parsedMessage]);
      });

      // Cleanup on component unmount
      return () => {
        socket.off('initialMessages');
        socket.off('newMessage');
        socket.disconnect();
      };
    }
  }, [isConnected, userId]);

  const handleConnect = () => {
    setIsConnected(true);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messageData = {
      name: 'You', // Identifying the sender as 'You' for local messages
      content: newMessage.trim(),
    };

    // Emit the message as JSON to the server through WebSocket
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

      {/* Connection dialog for entering userId */}
      <Dialog open={!isConnected} onClose={() => {}}>
        <DialogTitle>Connect to Chat</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Connecting as user {userId}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConnect} color="primary" variant="contained">
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ChatPage;
