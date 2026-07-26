import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import axios from 'axios'

// In-memory OTP store
const otpStore = new Map<string, { otp: string; expires: number }>()

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP via SMS (2Factor)
const sendOTPviaSMS = async (mobile: string, otp: string): Promise<boolean> => {
  try {
    const apiKey = process.env.TFACTOR_API_KEY
    const templateName = 'Vansh-OTP'
    
    if (!apiKey) {
      console.warn('⚠️ TFACTOR_API_KEY not configured')
      return false
    }

    const url = `https://2factor.in/API/V1/${apiKey}/SMS/${mobile}/${otp}/${templateName}`
    
    console.log(`📤 Sending SMS OTP to ${mobile}...`)
    
    const response = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000
    })
    
    if (response.data.Status === 'Success') {
      console.log(`✅ SMS OTP sent successfully to ${mobile}`)
      return true
    } else {
      console.error('❌ 2Factor SMS error:', response.data)
      return false
    }
  } catch (error: any) {
    console.error('❌ SMS send error:', error.response?.data || error.message)
    return false
  }
}

// Send OTP via Voice Call (2Factor)
const sendOTPviaVoice = async (mobile: string, otp: string): Promise<boolean> => {
  try {
    const apiKey = process.env.TFACTOR_API_KEY
    const templateName = 'Vansh-Voice-OTP'
    
    if (!apiKey) {
      console.warn('⚠️ TFACTOR_API_KEY not configured')
      return false
    }

    const url = `https://2factor.in/API/V1/${apiKey}/VOICE/${mobile}/${otp}/${templateName}`
    
    console.log(`📞 Sending Voice OTP to ${mobile}...`)
    
    const response = await axios.post(url, {}, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      timeout: 10000
    })
    
    if (response.data.Status === 'Success') {
      console.log(`✅ Voice OTP sent successfully to ${mobile}`)
      return true
    } else {
      console.error('❌ 2Factor Voice error:', response.data)
      return false
    }
  } catch (error: any) {
    console.error('❌ Voice send error:', error.response?.data || error.message)
    return false
  }
}

// Send OTP
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body

    console.log('📤 Send OTP for registration:', mobile)

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      })
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit mobile number'
      })
    }

    const existingUser = await User.findOne({ mobile })
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This mobile number is already registered. Please login.'
      })
    }

    const otp = generateOTP()
    console.log(`📱 OTP for ${mobile}: ${otp}`)

    otpStore.set(mobile, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    })

    // Try SMS first
    let smsSent = await sendOTPviaSMS(mobile, otp)
    let voiceSent = false
    
    // If SMS fails, try Voice
    if (!smsSent) {
      console.log('📞 SMS failed, trying Voice OTP...')
      voiceSent = await sendOTPviaVoice(mobile, otp)
    }

    res.json({
      success: true,
      message: smsSent ? 'OTP sent via SMS!' : voiceSent ? 'OTP sent via Voice Call!' : 'OTP generated (check console)',
      data: {
        mobile,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        expiresIn: 300,
        sentVia: smsSent ? 'sms' : voiceSent ? 'voice' : 'console'
      }
    })
  } catch (error: any) {
    console.error('Send OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    })
  }
}

// Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { mobile, otp, name } = req.body

    console.log(`🔍 Verifying OTP for ${mobile}: ${otp}`)

    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number and OTP are required'
      })
    }

    const stored = otpStore.get(mobile)

    if (!stored) {
      return res.status(400).json({
        success: false,
        message: 'OTP expired or not found. Please request a new OTP.'
      })
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(mobile)
      return res.status(400).json({
        success: false,
        message: 'OTP expired. Please request a new OTP.'
      })
    }

    if (stored.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please try again.'
      })
    }

    otpStore.delete(mobile)

    let user = await User.findOne({ mobile })

    if (!user) {
      user = new User({
        mobile,
        name: name || '',
        password: '',
        isVerified: false,
        role: 'user',
        otpVerified: true
      })
      await user.save({ validateBeforeSave: false })
      console.log('✅ Temporary user created:', user._id)
    } else {
      user.otpVerified = true
      if (name) user.name = name
      await user.save()
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        mobile: user.mobile, 
        role: user.role,
        otpVerified: true 
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '30m' }
    )

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      data: {
        userId: user._id,
        mobile: user.mobile,
        name: user.name,
        isVerified: user.isVerified,
        hasPassword: !!user.password
      }
    })
  } catch (error: any) {
    console.error('Verify OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP'
    })
  }
}

// Resend OTP
export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      })
    }

    const existingUser = await User.findOne({ mobile })
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'This mobile number is already registered.'
      })
    }

    const otp = generateOTP()
    console.log(`📱 Resend OTP for ${mobile}: ${otp}`)

    otpStore.set(mobile, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    })

    let smsSent = await sendOTPviaSMS(mobile, otp)
    let voiceSent = false
    
    if (!smsSent) {
      voiceSent = await sendOTPviaVoice(mobile, otp)
    }

    res.json({
      success: true,
      message: smsSent ? 'OTP resent via SMS!' : voiceSent ? 'OTP resent via Voice Call!' : 'OTP generated (check console)',
      data: {
        mobile,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        expiresIn: 300,
        sentVia: smsSent ? 'sms' : voiceSent ? 'voice' : 'console'
      }
    })
  } catch (error: any) {
    console.error('Resend OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    })
  }
}

// Set Password (Complete Registration)
export const setPassword = async (req: Request, res: Response) => {
  try {
    const { userId, password, name } = req.body

    console.log('📤 Completing registration for userId:', userId)

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: 'User ID and password are required'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    if (!user.otpVerified) {
      return res.status(400).json({
        success: false,
        message: 'OTP not verified. Please verify your mobile number first.'
      })
    }

    user.password = password
    user.isVerified = true
    if (name) user.name = name
    user.otpVerified = true
    await user.save()

    console.log('✅ User registered successfully:', user._id)

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Registration completed successfully!',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        isVerified: user.isVerified
      }
    })
  } catch (error: any) {
    console.error('Set password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to complete registration'
    })
  }
}

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body

    if (!mobile || !password) {
      return res.status(400).json({
        success: false,
        message: 'Mobile and password are required'
      })
    }

    const user = await User.findOne({ mobile })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Please register first.'
      })
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Account not verified. Please complete registration.'
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    user.loginCount = (user.loginCount || 0) + 1
    user.lastLogin = new Date()
    await user.save()

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        isVerified: user.isVerified,
        loginCount: user.loginCount
      }
    })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to login'
    })
  }
}