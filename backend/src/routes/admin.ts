import express from 'express'
import { protect, admin } from '../middleware/auth'
import { 
  getDashboardStats, 
  getRecentOrders,
  getAnalytics 
} from '../controllers/admin'

const router = express.Router()

// All admin routes are protected
router.get('/dashboard', protect, admin, getDashboardStats)
router.get('/orders/recent', protect, admin, getRecentOrders)
router.get('/analytics', protect, admin, getAnalytics)

export default router