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
app.use(cors({
    origin: 'http://whereswildcat.com', // Allow production client domain
    methods: ['GET', 'POST'],
    credentials: true
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
        origin: 'http://whereswildcat.com', // Allow production client domain
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
