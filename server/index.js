import https from 'https';
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.js';
import { Server } from 'socket.io';
import { startListener } from './controllers/userController.js';

const app = express();
const port = 6969;

// Middleware setup
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors({
    origin: 'https://whereswildcat.com', // Allow production client domain
    methods: ['GET', 'POST'],
    credentials: true
}));

// Routes
app.use('/user', userRoutes);

app.get('/', (req, res) => {
    res.send('hello world');
    console.log('Root request received');
});

// Load SSL certificates
const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/whereswildcat.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/whereswildcat.com/fullchain.pem')
};

// Create HTTPS server and initialize WebSocket server
const server = https.createServer(httpsOptions, app);
const io = new Server(server, {
    cors: {
        origin: 'https://whereswildcat.com',
        methods: ['GET', 'POST'],
        credentials: true
    },
});

// Initialize WebSocket listener
startListener(io);

// Start the server
server.listen(port, () => {
    console.log(`Secure server listening on port ${port}`);
});
