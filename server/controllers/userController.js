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

export const createSocket = (req, res) => {
    res.status(500).json({message: 'not implemented'})


}
