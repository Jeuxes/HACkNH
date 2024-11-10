// Import dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
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

// Serve static files from the client build directory
app.use(express.static(path.join(__dirname, 'build')));

// Set up API routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('hello world');
    console.log('Root request received');
});

// Catch-all route to serve `index.html` for client-side routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
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
server.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});
