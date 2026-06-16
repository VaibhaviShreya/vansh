import express from 'express'
import { protect } from '../middleware/auth'
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus,
  getMyOrders 
} from '../controllers/orders'

const router = express.Router()

// Protected routes
router.post('/', protect, createOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/:id', protect, getOrderById)

// Admin routes
router.get('/', protect, getOrders)
router.put('/:id/status', protect, updateOrderStatus)

export default router