import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { setOTP, getOTP, deleteOTP } from '../config/redis'
import axios from 'axios'

// Send OTP
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await setOTP(mobile, otp)

    const response = await axios.post(
      `https://2factor.in/API/V1/${process.env.TFACTOR_API_KEY}/SMS/${mobile}/${otp}/OTP_TEMPLATE`
    )

    if (response.data.Status !== 'Success') {
      return res.status(500).json({ message: 'Failed to send OTP' })
    }

    res.json({
      success: true,
      message: 'OTP sent successfully',
      session: response.data.Details,
    })
  } catch (error) {
    console.error('Send OTP error:', error)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}

// Verify OTP
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { mobile, otp } = req.body

    if (!mobile || !otp) {
      return res.status(400).json({ message: 'Mobile and OTP are required' })
    }

    const storedOTP = await getOTP(mobile)

    if (!storedOTP) {
      return res.status(400).json({ message: 'OTP expired or invalid' })
    }

    if (storedOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    await deleteOTP(mobile)

    let user = await User.findOne({ mobile })

    if (!user) {
      user = new User({
        mobile,
        name: req.body.name || '',
        password: '',
        isVerified: false,
      })
      await user.save()
    }

    const token = jwt.sign(
      { id: user._id, mobile: user.mobile },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' } as jwt.SignOptions
    )

    res.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        mobile: user.mobile,
        name: user.name,
        isVerified: user.isVerified,
        hasPassword: !!user.password,
      },
    })
  } catch (error) {
    console.error('Verify OTP error:', error)
    res.status(500).json({ message: 'Failed to verify OTP' })
  }
}

// Set password
export const setPassword = async (req: Request, res: Response) => {
  try {
    const { userId, password } = req.body

    if (!userId || !password) {
      return res.status(400).json({ message: 'User ID and password are required' })
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.password = password
    user.isVerified = true
    await user.save()

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' } as jwt.SignOptions
    )

    res.json({
      success: true,
      message: 'Password set successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
      },
    })
  } catch (error) {
    console.error('Set password error:', error)
    res.status(500).json({ message: 'Failed to set password' })
  }
}

// Login
export const login = async (req: Request, res: Response) => {
  try {
    const { mobile, password } = req.body

    if (!mobile || !password) {
      return res.status(400).json({ message: 'Mobile and password are required' })
    }

    const user = await User.findOne({ mobile })
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Account not verified' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' } as jwt.SignOptions
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
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Failed to login' })
  }
}

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { mobile } = req.body

    if (!mobile) {
      return res.status(400).json({ message: 'Mobile number is required' })
    }

    const user = await User.findOne({ mobile })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await setOTP(mobile, otp)

    await axios.post(
      `https://2factor.in/API/V1/${process.env.TFACTOR_API_KEY}/SMS/${mobile}/${otp}/OTP_TEMPLATE`
    )

    res.json({
      success: true,
      message: 'OTP sent for password reset',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({ message: 'Failed to send OTP' })
  }
}

// Reset password
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { mobile, otp, newPassword } = req.body

    if (!mobile || !otp || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const storedOTP = await getOTP(mobile)
    if (!storedOTP || storedOTP !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    await deleteOTP(mobile)

    const user = await User.findOne({ mobile })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password reset successfully',
    })
  } catch (error) {
    console.error('Reset password error:', error)
    res.status(500).json({ message: 'Failed to reset password' })
  }
}