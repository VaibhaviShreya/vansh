import express from 'express'
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products'
import { protect, admin } from '../middleware/auth'
import { upload } from '../middleware/upload'

const router = express.Router()

router.get('/', getProducts)
router.get('/:slug', getProductBySlug)

// Admin routes
router.post('/', protect, admin, upload.array('images', 5), createProduct)
router.put('/:id', protect, admin, upload.array('images', 5), updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

export default router