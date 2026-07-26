import express from 'express'
import {
  getProducts,
  getProductBySlug,
  resetProducts,
} from '../controllers/products'

const router = express.Router()

router.get('/', getProducts)
router.get('/slug/:slug', getProductBySlug)
router.delete('/all', resetProducts)

export default router