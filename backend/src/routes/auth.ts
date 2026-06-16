import express from 'express'
import {
  sendOTP,
  verifyOTP,
  setPassword,
  login,
  forgotPassword,
  resetPassword,
} from '../controllers/auth'
import { protect } from '../middleware/auth'

const router = express.Router()

router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTP)
router.post('/set-password', setPassword)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)

// Protected route example
router.get('/me', protect, async (req: any, res) => {
  res.json({ user: req.user })
})

export default router