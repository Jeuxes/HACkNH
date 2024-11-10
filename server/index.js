// Import dependencies
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js';
import http from 'http';
import { Server } from 'socket.io';
import { startListener, matchUsers } from './controllers/userController.js';

const app = express();
const port = 6969;

// Middleware setup
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({
    origin: 'http://localhost:3000', // Allow client origin
    methods: ['GET', 'POST'],
    credentials: true // Allow credentials sharing
}));

// Routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('hello world');
    console.log('Root request received');
});

// Create HTTP server and initialize WebSocket server
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Specific client origin
        methods: ['GET', 'POST'],
        credentials: true
    },
});

// Initialize WebSocket listener
startListener(io);

// Start the server
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

setInterval(matchUsers, 15000)
