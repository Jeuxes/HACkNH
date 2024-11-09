import express from 'express'

import {login, updateLoc, startListener} from '../controllers/userController.js'

const router = express.Router()

router.post('/login', login)
router.post('/updateLoc', updateLoc)
router.post('/startListener', startListener)

export default router

