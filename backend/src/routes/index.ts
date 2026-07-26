import express from 'express'
import authRoutes from './auth'
import productRoutes from './products'

const router = express.Router()

// Mount routes
router.use('/auth', authRoutes)
router.use('/products', productRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString()
  })
})

export default router