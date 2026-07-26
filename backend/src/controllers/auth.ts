import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

// In-memory OTP store
const otpStore = new Map<string, { otp: string; expires: number }>()

const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body

    console.log('📤 Send OTP for:', mobile)

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

    const otp = generateOTP()
    console.log(`📱 OTP for ${mobile}: ${otp}`)

    otpStore.set(mobile, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    })

    res.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        mobile,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        expiresIn: 300
      }
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    })
  }
}

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
        message: 'OTP expired or not found'
      })
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(mobile)
      return res.status(400).json({
        success: false,
        message: 'OTP expired'
      })
    }

    if (stored.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      })
    }

    otpStore.delete(mobile)

    // Check if user exists
    let user = await User.findOne({ mobile })

    if (!user) {
      // Create temporary user with empty password
      // Using save() with validate: false to bypass validation
      user = new User({
        mobile,
        name: name || '',
        password: '', // Empty password
        isVerified: false,
        role: 'user',
        otpVerified: true
      })
      await user.save({ validateBeforeSave: false })
      console.log('✅ Temporary user created:', user._id)
    }

    const token = jwt.sign(
      { id: user._id, mobile: user.mobile, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '10m' }
    )

    res.json({
      success: true,
      message: 'OTP verified',
      token,
      data: {
        userId: user._id,
        mobile: user.mobile,
        name: user.name,
        isVerified: user.isVerified,
        hasPassword: !!user.password
      }
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to verify OTP',
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      })
    }

    const otp = generateOTP()
    console.log(`📱 Resend OTP for ${mobile}: ${otp}`)

    otpStore.set(mobile, {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    })

    res.json({
      success: true,
      message: 'OTP resent',
      data: {
        mobile,
        otp: process.env.NODE_ENV === 'development' ? otp : undefined,
        expiresIn: 300
      }
    })
  } catch (error) {
    console.error('Resend OTP error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to resend OTP'
    })
  }
}

export const setPassword = async (req: Request, res: Response) => {
  try {
    const { userId, password, name } = req.body

    console.log('📤 Setting password for user:', userId)

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

    // Update user with password and name
    user.password = password
    user.isVerified = true
    if (name) user.name = name
    await user.save()

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Registration completed',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    console.error('Set password error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to set password'
    })
  }
}

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
        message: 'Invalid credentials'
      })
    }

    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Account not verified'
      })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

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
        isVerified: user.isVerified
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to login'
    })
  }
}