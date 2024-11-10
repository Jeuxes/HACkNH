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

// CORS setup to allow requests from your front end
app.use(cors({
    origin: ['http://whereswildcats.com', 'https://whereswildcats.com'],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Set up routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('hello world');
    console.log('Root request received');
});

// Create HTTP server and initialize WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://whereswildcats.com', 'https://whereswildcats.com'],
        methods: ['GET', 'POST'],
        credentials: true
    },
});

// Initialize WebSocket listener for custom handling
startListener(io);

// Start the server
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
