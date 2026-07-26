import express from 'express'
import { protect } from '../middleware/auth'

const router = express.Router()

// Protected routes (will add admin check later)
router.get('/dashboard', protect, (req: any, res) => {
  res.json({ 
    message: 'Admin dashboard',
    user: req.user 
  })
})

router.get('/orders/recent', protect, (req: any, res) => {
  res.json({ 
    message: 'Recent orders',
    orders: [] 
  })
})

router.get('/analytics', protect, (req: any, res) => {
  res.json({ 
    message: 'Analytics data',
    data: {
      totalUsers: 0,
      totalOrders: 0,
      revenue: 0
    }
  })
})

export default router