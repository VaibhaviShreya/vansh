import { Request, Response } from 'express'
import { User } from '../models/User'

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    res.status(500).json({ message: 'Failed to fetch users' })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Failed to fetch user' })
  }
}

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
}

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, mobile } = req.body
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, mobile },
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Failed to update profile' })
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    }).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    })
  } catch (error) {
    console.error('Update user error:', error)
    res.status(500).json({ message: 'Failed to update user' })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const user = await User.findByIdAndDelete(id)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Failed to delete user' })
  }
}