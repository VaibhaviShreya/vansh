import express from 'express'
import {
  sendOTP,
  verifyOTP,
  resendOTP,
  setPassword,
  login,
} from '../controllers/auth'

const router = express.Router()

// OTP Routes
router.post('/send-otp', sendOTP)
router.post('/verify-otp', verifyOTP)
router.post('/resend-otp', resendOTP)

// Registration
router.post('/set-password', setPassword)

// Login
router.post('/login', login)

export default router