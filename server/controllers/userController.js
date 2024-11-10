import generateUniqueId from 'generate-unique-id'
import pool from './db.js'
import {packInterests} from '../util/interests.js'


// To store location/match/socket info
/**
 * {
 *   "user ID": {
 *     name: "Name",
 *     location: [lat, long],
 *     currentVenue: "Venue Name (must match key in venues)",
 *     socketId: socketId
 *   }
 * }
 */
export let activeUsers = {}

/**
 * {
 *   "Venue Name": {
 *     location: "(lat, long)",
 *     type: "type"
 *   }
 * }
 */
export let venues = {}


const getUser = async (uid) => {
    const query = `SELECT * FROM users WHERE uid=${uid};`
    
    const result = await pool.query(query)

    if (result.rowCount != 1) {
        console.error(`Query for uid ${uid} returned ${result.rowCount} rows!`)
        return null;
    }

    return result.rows[0]
}

export const register = async (req, res) => {
    const { firstName, lastName, interests } = req.body; // Destructure with proper names
    try {
      // Generate unique user ID
      const uid = generateUniqueId();
  
      // Use a parameterized query to insert data securely
      const query = 'INSERT INTO users(uid, firstname, lastname, interests) VALUES ($1, $2, $3, $4)';
      const values = [uid, firstName, lastName, packInterests(interests)];
  
      const result = await pool.query(query, values);
  
      if (result.rowCount !== 1) {
        throw new Error('Error inserting user');
      }
  
      console.log(`User '${firstName} ${lastName}' registered with uid ${uid}`);
      
      // Respond with 'userId' to match front-end expectations
      res.status(200).json({ status: 'Success', userId: uid });
    } catch (err) {
      console.error(`Error registering user:`, req.body, err);
      res.status(422).json({ message: err.message });
    }
  };

  
  

export const updateLoc = (req, res) => {
    res.status(200).json(null) // temp so client doesn't wait
    // const post = req.body

    // try {

    //     const uid = post['uid']
    //     const lat = post['lat']
    //     const long = post['long']


    // } catch (err) {
    //     res.status(422).json({message: err.message})
    // }
    
}

export const getHotspots = (req, res) => {
    // const {uid} = req.body
}   

export const startListener = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
  
        // Register a listener to handle user identification after connection
        socket.on('register', async (uid) => {
            if (!(uid in activeUsers)) {
                const userData = await getUser(uid)
                activeUsers[uid] = {
                    name: userData.name,
                    location: null,
                    currentVenue: null,
                    socketId: socket.id
                }
            } else {
                activeUsers[uid].socketId = socket.id
            }

            console.log(`User ${uid} is registered with socket ID: ${socket.id}`);
        });
  
        // Listen for direct messages
        socket.on('sendMessage', (messageData) => {
            const { senderId, content, timestamp } = messageData;
            console.log(`Message from User ${senderId} to User ${recipientId}: ${content} (Timestamp: ${timestamp})`);
  
            // Find the recipient's socket ID
            // const recipientSocketId = activeUsers[recipientId];
            // if (recipientSocketId) {
            //     // Send the message to the recipient
            //     io.to(recipientSocketId).emit('newMessage', { senderId, content, timestamp });
            // } else {
            //     console.log(`User ${recipientId} is not connected.`);
            // }
        });
  
        // Handle user disconnect
        socket.on('disconnect', () => {
            const disconnectedUserId = Object.keys(activeUsers).find(
                (uid) => activeUsers[uid].socketId === socket.id
            );
            if (disconnectedUserId) {
                delete activeUsers[disconnectedUserId];
                console.log(`User ${disconnectedUserId} disconnected.`);
            }
        });
    });
};