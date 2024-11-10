import generateUniqueId from 'generate-unique-id';
import pool from './db.js';
import { packInterests, unpackInterests } from '../util/interests.js';

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

// Stolen from https://stackoverflow.com/questions/43122082/efficiently-count-the-number-of-bits-in-an-integer-in-javascript
const count1s32 = (i) => {
    let count = 0;
    i = i - ((i >> 1) & 0x55555555);
    i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
    i = (i + (i >> 4)) & 0x0f0f0f0f;
    i = i + (i >> 8);
    i = i + (i >> 16);
    count += i & 0x3f;
    return count;
}

export const matchUsers = async () => {
    for (const [hsName, hs] of Object.entries(hotspots)) {

        // Maps uids to interests
        let hsUserInterests = {}

        for (const [uid, userData] of Object.entries(activeUsers)) {
            if (!userData.matched && userData.currentVenue === hsName) {
                const dbrow = await getUser(uid)
                hsUserInterests[uid] = dbrow.interests
            }
        }

        const value = (interestA, interestB) => {
            return count1s32(interestA & interestB)
        }

        let hsUsers = Object.keys(hsUserInterests)
        while (hsUsers.length >= 2) {
            // Select the first user and remove them from the list
            let userA = hsUsers[0]
            hsUsers.splice(0, 1)

            // Find the value of every combination of the selected user and the other users at the venue
            let pairValues = []
            for (let i=0; i<hsUsers.length; i++) {
                let userB = hsUsers[i]
                let userAInterests = hsUserInterests[userA]
                let userBInterests = hsUserInterests[userB]
                pairValues.push(value(userAInterests, userBInterests))
            }

            // Find the partner that makes the highest value combination
            let maxIndex = 0
            let maxVal = pairValues[0]
            for (let i=0; i<hsUsers.length; i++) {
                if (pairValues[i] > maxVal) {
                    maxIndex = i
                    maxVal = pairValues[i]
                }
            }

            // maxIndex should now be the index into hsUsers of the best matching user
            let bestMatch = hsUsers[maxIndex]
            hsUsers.splice(maxIndex, 1)

            // Now actually assign them to each other in activeUsers
            activeUsers[userA].matchUid = bestMatch
            activeUsers[userA].matched = true
            activeUsers[userA].accepted = false
            activeUsers[bestMatch].matchUid = userA
            activeUsers[bestMatch].matched = true
            activeUsers[bestMatch].accepted = false

            const userAInterests = hsUserInterests[userA]
            const bestMatchInterests = hsUserInterests[bestMatch]

            const commonInterests = unpackInterests(userAInterests & bestMatchInterests)

            activeUsers[userA].socket.emit('match', commonInterests)
            activeUsers[bestMatch].socket.emit('match', commonInterests)
        }
    }
}


export const getHotspots = async (req, res) => {
    res.status(200).json(hotspots);
};

export const startListener = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('register', async (uid) => {
            console.log(`call on 'register'`);
            let userData = null;
            if (!(uid in activeUsers)) {
                userData = await getUser(uid);
                activeUsers[uid] = {
                    firstName: userData.firstname,
                    lastName: userData.lastname,
                    socket: socket
                };
            } else {
                activeUsers[uid].socket = socket;
            }

            console.log(`User ${uid} is registered with socket ID: ${socket.id}`);
        });

        socket.on('matchResponse', (uid, accept) => {
            let matchUid;
            console.log(`User ${uid}: ${accept?"Accepted":"declined"}`);
            
            if (!accept) {
                matchUid = activeUsers[uid].matchUid
                if (activeUsers[matchUid]) {
                    activeUsers[matchUid].socket.emit('partnerDisconnect');
                    activeUsers[matchUid].matched = false
                    activeUsers[matchUid].accepted = false;
                    delete activeUsers[matchUid]['matchUid']
                    delete activeUsers[uid]['matchUid']
                }
                activeUsers[uid].matched = false
                activeUsers[uid].accepted = false;
            } else {
                activeUsers[uid].accepted = true;
                matchUid = activeUsers[uid].matchUid // other user
                if (activeUsers[matchUid].accepted) { // if other user accepted
                    activeUsers[matchUid].matchUid = uid;
                    activeUsers[matchUid].matched = true;
                    activeUsers[uid].matched = true;
                    activeUsers[matchUid].socket.emit('partnerAccept');
                    activeUsers[uid].socket.emit('partnerAccept');
                }
            }
        })
        
        socket.on('startFind', async (userId) => {
            console.log(`${userId} initiated find...`);
            const result = await matchUsers();
            console.log(result);
        });

        socket.on('sendMessage', (messageData) => {
            const { senderId, content, timestamp } = messageData
            console.log(senderId);
            let matchUid_ = activeUsers[senderId].matchUid // other user
            console.log(matchUid_);
            if (!activeUsers[senderId] || !activeUsers[senderId].matched) {
                console.warn(`Warning: User ${senderId} tried to send a message but did not have a match, ignoring`)
                return
            }

            let matchUid = activeUsers[senderId].matchUid

            console.log(`Message from user ${senderId} to user ${matchUid}: ${content} (Timestamp: ${timestamp})`);

            if (activeUsers[matchUid]?.socket) {
                activeUsers[matchUid].socket.emit('newMessage', { senderId, content, timestamp });
            } else {
                console.log(`User ${matchUid} is not connected.`);
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

                if (activeUsers[disconnectedUserId].matched) {
                    let matchUid = activeUsers[disconnectedUserId].matchUid
                    delete activeUsers[matchUid]['matchUid']
                    activeUsers[matchUid].matched = false
                    activeUsers[matchUid].accepted = false;
                    activeUsers[matchUid].socket.emit('partnerDisconnect')
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
