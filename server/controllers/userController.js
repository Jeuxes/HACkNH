import generateUniqueId from 'generate-unique-id';
import pool from './db.js';
import { packInterests } from '../util/interests.js';

export let activeUsers = {};
export let hotspots = {};

const getUser = async (uid) => {
    const query = `SELECT * FROM users WHERE uid = $1;`;
    const result = await pool.query(query, [uid]);

    if (result.rowCount !== 1) {
        console.error(`Query for uid ${uid} returned ${result.rowCount} rows (expected 1)`);
        throw new Error(`Query for uid ${uid} returned ${result.rowCount} rows (expected 1)`);
    }

    return result.rows[0];
};

export const register = async (req, res) => {
    const { firstName, lastName, interests } = req.body;
    try {
        const uid = generateUniqueId();
        const query = 'INSERT INTO users(uid, firstname, lastname, interests) VALUES ($1, $2, $3, $4)';
        const values = [uid, firstName, lastName, packInterests(interests)];

        const result = await pool.query(query, values);

        if (result.rowCount !== 1) {
            throw new Error('Error inserting user');
        }

        console.log(`User '${firstName} ${lastName}' registered with uid ${uid}`);
        res.status(200).json({ status: 'Success', userId: uid });
    } catch (err) {
        console.error(`Error registering user:`, req.body, err);
        res.status(422).json({ message: err.message });
    }
};

export const updateLoc = (req, res) => {
    const { uid, lat, lon } = req.body;

    try {
        if (!(uid in activeUsers)) {
            throw new Error(`User ${uid} not active, try logging in again`);
        }

        activeUsers[uid].lat = lat;
        activeUsers[uid].lon = lon;

        res.status(200).json({ message: 'Location updated successfully' });
    } catch (err) {
        console.error(`User ${uid} tried to update location, but user was not active`);
        res.status(500).json({ message: err.message });
    }
};

export const setVenue = (req, res) => {
    const { uid, venueName, lat, lon } = req.body;

    try {
        if (!(uid in activeUsers)) {
            const emsg = `User ${uid} not active, try logging in again`;
            console.error(emsg);
            throw new Error(emsg);
        }

        activeUsers[uid].currentVenue = venueName;

        if (venueName in hotspots) {
            hotspots[venueName].users += 1;
        } else {
            hotspots[venueName] = {
                lat: lat,
                lon: lon,
                users: 1
            };
        }

        res.status(200).json({ message: 'Venue set successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getHotspots = async (req, res) => {
    res.status(200).json(hotspots);
};

export const startListener = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('register', async (uid, callback) => {
            console.log(`call on 'register'`);
            let userData = null;
            if (!(uid in activeUsers)) {
                userData = await getUser(uid);
                activeUsers[uid] = {
                    firstName: userData.firstname,
                    lastName: userData.lastname,
                    location: null,
                    currentVenue: null,
                    socket: socket
                };
            } else {
                activeUsers[uid].socket = socket;
            }

            console.log(`User ${uid} is registered with socket ID: ${socket.id}`);
            callback({
                userData: userData,
            });
        });

        socket.on('sendMessage', (messageData) => {
            const { senderId, recipientId, content, timestamp } = messageData;
            console.log(`Message from User ${senderId} to User ${recipientId}: ${content} (Timestamp: ${timestamp})`);

            if (activeUsers[recipientId]?.socket) {
                activeUsers[recipientId].socket.emit('newMessage', { senderId, content, timestamp });
            } else {
                console.log(`User ${recipientId} is not connected.`);
            }
        });

        socket.on('disconnect', () => {
            const disconnectedUserId = Object.keys(activeUsers).find(
                (uid) => activeUsers[uid].socket.id === socket.id
            );

            if (disconnectedUserId) {
                const venue = activeUsers[disconnectedUserId].currentVenue;
                if (venue && hotspots[venue]) {
                    hotspots[venue].users > 1
                        ? hotspots[venue].users -= 1
                        : delete hotspots[venue];
                }

                delete activeUsers[disconnectedUserId];
                console.log(`User ${disconnectedUserId} disconnected.`);
            }
        });
    });
};

export const logUsers = (req, res) => {
    let fuck = activeUsers
    for (const [uid, data] of Object.entries(fuck)) {
        delete fuck[uid]['socket']
    }

    console.log(fuck);
    res.status(200).json(fuck);
};
