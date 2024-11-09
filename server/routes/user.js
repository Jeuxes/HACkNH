import express from 'express'

import {register, updateLoc, getHotspots} from '../controllers/userController.js'

const router = express.Router()

router.post('/register', register)
router.post('/updateLoc', updateLoc)
router.post('/getHotspots', getHotspots)

export default router

