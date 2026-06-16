import express from 'express'
import { protect, admin } from '../middleware/auth'
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categories'

const router = express.Router()

// Public routes
router.get('/', getCategories)

// Admin routes
router.post('/', protect, admin, createCategory)
router.put('/:id', protect, admin, updateCategory)
router.delete('/:id', protect, admin, deleteCategory)

export default router