import express from 'express'

import {register, updateLoc, getHotspots, setVenue, logUsers} from '../controllers/userController.js'

const router = express.Router()

router.post('/register', register)
router.post('/updateLoc', updateLoc)
router.post('/getHotspots', getHotspots)
router.post('/setVenue', setVenue)


router.get('/logUsers', logUsers)

export default router

