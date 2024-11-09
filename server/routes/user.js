import express from 'express'

import {login, updateLoc, createSocket} from '../controllers/userController.js'

const router = express.Router()

router.post('/login', login)
router.post('/updateLoc', updateLoc)
router.post('/createSocket', createSocket)

export default router

