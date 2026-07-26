import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { setOTP, getOTP, deleteOTP } from '../config/redis'

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body

    if (!mobile) {
      return res.status(400).json({ 
        success: false,
        message: 'Mobile number is required' 
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await setOTP(mobile, otp)
    console.log(`📱 OTP for ${mobile}: ${otp}`)

    res.json({
      success: true,
      message: 'OTP sent successfully',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined,
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
    const { mobile, otp, email, name } = req.body

    if (!mobile || !otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Mobile and OTP are required' 
      })
    }

    const storedOTP = await getOTP(mobile)

    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid or expired OTP' 
      })
    }

    await deleteOTP(mobile)

    let user = await User.findOne({ mobile })

    if (!user) {
      user = new User({
        mobile,
        name: name || '',
        email,
        isVerified: false,
        role: 'user',
      })
      await user.save()
      console.log('✅ New user created:', user._id)
    }

    if (email && user.email !== email.toLowerCase()) {
      user.email = email
      if (name) user.name = name
      await user.save()
    }

    const token = jwt.sign(
      { id: user._id, mobile: user.mobile, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    )

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        mobile: user.mobile,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        hasPassword: !!user.password,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify OTP' 
    })
  }
}

export const setPassword = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body

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

    user.password = password
    user.isVerified = true
    await user.save()
    console.log('✅ Password set for user:', user._id)

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({
      success: true,
      message: 'Password set successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
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
      process.env.JWT_SECRET!,
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
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to login' 
    })
  }
}
