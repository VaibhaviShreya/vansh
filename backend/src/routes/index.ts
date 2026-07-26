import express from 'express'
import authRoutes from './auth'
import productRoutes from './products'
import orderRoutes from './orders'
import categoryRoutes from './categories'

const router = express.Router()

// Mount routes
router.use('/auth', authRoutes)
router.use('/products', productRoutes)
router.use('/orders', orderRoutes)
router.use('/categories', categoryRoutes)

// Health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    services: {
      api: 'running',
      mongodb: 'connected'
    }
  })
})

export default router