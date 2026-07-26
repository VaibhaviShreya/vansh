import express from 'express'
import {
  getProducts,
  getProductBySlug,
} from '../controllers/products'

const router = express.Router()

// Public routes
router.get('/', getProducts)
router.get('/slug/:slug', getProductBySlug)

export default router