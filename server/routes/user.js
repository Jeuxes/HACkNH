import express from 'express'

import {register, updateLoc, startListener} from '../controllers/userController.js'

const router = express.Router()

router.post('/register', register)
router.post('/updateLoc', updateLoc)

export default router

