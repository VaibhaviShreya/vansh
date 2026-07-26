import express from 'express'
import { protect } from '../middleware/auth'
import { createOrder, getMyOrders, getOrderById, getOrders, updateOrderStatus } from '../controllers/orders'

const router = express.Router()

// Protected routes
router.get('/', protect, getOrders)

router.get('/my-orders', protect, getMyOrders)

router.get('/:id', protect, getOrderById)

router.post('/', protect, createOrder)

router.put('/:id/status', protect, updateOrderStatus)

export default router
