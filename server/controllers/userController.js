import generateUniqueId from 'generate-unique-id'
import pool from './db.js'
import {packInterests} from '../util/interests.js'


// To store location/match/socket info
/**
 * {
 *   "user ID": {
 *     name: "Name",
 *     lat: lat,
 *     long: long,
 *     currentVenue: "Venue Name (must match key in venues)",
 *     socket: socket
 *   }
 * }
 */
export let activeUsers = {}

/**
 * {
 *   "Venue Name": {
 *     lat: lat,
 *     lon: lon,
 *     users: #users
 *   }
 * }
 */
export let hotspots = {}

// To be called periodically
// export const matchUsers = () => {
//     for (const [hsName, hs] of Object.entries(hotspots)) {
//         let users = []


//     }
// }


const getUser = async (uid) => {
    const query = `SELECT * FROM users WHERE uid=${uid};`
    
    const result = await pool.query(query)

    if (result.rowCount != 1) {
        console.error(`Query for uid ${uid} returned ${result.rowCount} rows (expected 1)`)
        console.error('Are there multiple servers accessing the database?')
        throw new Error(`Query for uid ${uid} returned ${result.rowCount} rows (expected 1)`)
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
    const {uid, lat, lon} = req.body

    try {
        if (!(uid in activeUsers)) {
            throw new Error(`User ${uid} not active, try logging in again`)
        }

        activeUsers[uid].lat = lat
        activeUsers[uid].lon = lon

    } catch (err) {
        console.error(`User ${uid} tried to update location, but user was not active`)
        res.status(500).json({ message: err.message })
    }
}

export const setVenue = (req, res) => {
    const {uid, venueName, lat, lon} = req.body

    try {
        if (!(uid in activeUsers)) {
            const emsg = `User ${uid} not active, try logging in again`
            console.error(emsg)
            throw new Error(emsg)
        }

        activeUsers[uid].currentVenue = venueName

        if (venueName in hotspots) {
            hotspots[venueName].users += 1
        } else {
            hostspots[venueName] = {
                lat: lat,
                lon: lon,
                users: 1
            }
        }

        res.status(200).json(null)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

export const getHotspots = async (req, res) => {
    const {uid} = req.body

    res.status(200).json(hotspots)
}   

export const startListener = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);
  
        // Register a listener to handle user identification after connection
        socket.on('register', async (uid) => {
            if (!(uid in activeUsers)) {
                const userData = await getUser(uid)
                activeUsers[uid] = {
                    firstName: userData.firstname,
                    lastName: userData.lastname,
                    location: null,
                    currentVenue: null,
                    socket: socket
                }
            } else {
                activeUsers[uid].socket = socket
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
                (uid) => activeUsers[uid].socket.id === socket.id
            );
            if (disconnectedUserId) {
                if (activeUsers[disconnectedUserId].currentVenue in hotspots) {
                    if (hotspots[activeUsers[disconnectedUserId].currentVenue].users > 1) {
                        hotspots[activeUsers[disconnectedUserId].currentVenue].users -= 1
                    } else {
                        delete hotspots[activeUsers[disconnectedUserId].currentVenue]
                    }
                }
                delete activeUsers[disconnectedUserId];
                console.log(`User ${disconnectedUserId} disconnected.`);
            }
        });
    });
};

export const logUsers = (req, res) => {
    console.log(activeUsers)
}