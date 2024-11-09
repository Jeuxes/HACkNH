import generateUniqueId from 'generate-unique-id'
import pool from './db.js'
import {packInterests} from '../util/interests.js'


// To store location/match/socket info
export let activeUsers = {}

export const login = async (req, res) => {
    const post = req.body


    try {
        if (typeof post.name !== 'string' || Object.prototype.toString.call(post.interests) !== '[object Array]') {
            throw {message: 'invalid login parameters'}
        }

        const uid = generateUniqueId()

        const query = 'INSERT INTO users(uid,name,interests) VALUES ($1,$2,$3)'
        const vals = [uid, post['name'], packInterests(post["interests"])]

        const result = await pool.query(query, vals)

        if (result.rowCount != 1) {
            throw {message: 'error inserting', result: result}
        }

        console.log(`User \'${post['name']}\' registered with uid ${uid}`)

        res.status(200).json({status: 'Success', uid: uid})
    } catch (err) {
        res.status(422).json({message: err.message})
    }
}

export const updateLoc = (req, res) => {
    const post = req.body

    try {

        const uid = post['uid']
        const lat = post['lat']
        const long = post['long']


    } catch (err) {
        res.status(422).json({message: err.message})
    }
    
}

export const startListener = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
  
        // Register a listener to handle user identification after connection
        socket.on('register', (uid) => {
            activeUsers[uid] = socket.id; // Map userId to their socket ID
            console.log(`User ${uid} is registered with socket ID: ${socket.id}`);
        });
  
        // Listen for direct messages
        socket.on('sendMessage', (messageData) => {
            const { senderId, recipientId, content, timestamp } = messageData;
            console.log(`Message from User ${senderId} to User ${recipientId}: ${content} (Timestamp: ${timestamp})`);
  
            // Find the recipient's socket ID
            const recipientSocketId = activeUsers[recipientId];
            if (recipientSocketId) {
                // Send the message to the recipient
                io.to(recipientSocketId).emit('newMessage', { senderId, content, timestamp });
            } else {
                console.log(`User ${recipientId} is not connected.`);
            }
        });
  
        // Handle user disconnect
        socket.on('disconnect', () => {
            const disconnectedUserId = Object.keys(activeUsers).find(
                (uid) => activeUsers[uid] === socket.id
            );
            if (disconnectedUserId) {
                delete activeUsers[disconnectedUserId];
                console.log(`User ${disconnectedUserId} disconnected.`);
            }
        });
    });
};