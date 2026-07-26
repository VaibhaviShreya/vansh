import express from 'express'
import { protect } from '../middleware/auth'

const router = express.Router()

// Protected routes
router.get('/profile', protect, (req: any, res) => {
  res.json({ 
    message: 'User profile',
    user: req.user 
  })
})

router.put('/profile', protect, (req: any, res) => {
  res.json({ 
    message: 'Profile updated',
    user: req.user 
  })
})

export default router