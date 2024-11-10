// Import dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js';
import http from 'http';
import { Server } from 'socket.io';
import { startListener } from './controllers/userController.js';

const app = express();
const port = 6969;

// Middleware setup
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

// CORS setup to allow requests from your front end on Netlify
app.use(cors({
    origin: ['https://67307b3588db9e84d1409406--whereswildcat.netlify.app', 'https://whereswildcats.com'],  // Allow both the Netlify URL and the root domain
    methods: ['GET', 'POST'],
    credentials: true
}));

// Set up API routes
app.use('/user', userRoutes);

// Create HTTP server and initialize WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['https://67307b3588db9e84d1409406--whereswildcat.netlify.app', 'https://whereswildcats.com'],  // Allow both the Netlify URL and the root domain
        methods: ['GET', 'POST'],
        credentials: true
    },
});

// Initialize WebSocket listener for custom handling
startListener(io);

// Start the server
server.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});
