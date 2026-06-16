import express from 'express'
import { protect, admin } from '../middleware/auth'
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  getProfile,
  updateProfile 
} from '../controllers/users'

const router = express.Router()

// Protected routes
router.get('/profile', protect, getProfile)
router.put('/profile', protect, updateProfile)

// Admin routes
router.get('/', protect, admin, getUsers)
router.get('/:id', protect, admin, getUserById)
router.put('/:id', protect, admin, updateUser)
router.delete('/:id', protect, admin, deleteUser)

export default router