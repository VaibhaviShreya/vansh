import { Request, Response } from 'express'
import { Order } from '../models/Order'
import { Product } from '../models/Product'
import { sendOrderConfirmationEmail } from '../services/email'

export const createOrder = async (req: any, res: Response) => {
  try {
    const { productId, quantity, companyName, city, message, mobile, phone, email, name } = req.body
    const phoneNumber = mobile || phone

    if (!name || !phoneNumber || !email || !companyName || !city) {
      return res.status(400).json({ message: 'Name, email, phone number, company name, and city are required' })
    }

    // Validate product
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Validate MOQ
    if (quantity < 500) {
      return res.status(400).json({ message: 'Minimum order quantity is 500 KG' })
    }

    const order = new Order({
      userId: req.user.id,
      productId,
      quantity,
      companyName,
      city,
      message,
      mobile: phoneNumber,
      email,
      name,
      status: 'pending'
    })

    await order.save()

    sendOrderConfirmationEmail(email, {
      orderNumber: order._id.toString(), productName: product.name, quantity, companyName, city,
    }, name).catch((emailError) => console.error('Order email error:', emailError))

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    })
  } catch (error) {
    console.error('Create order error:', error)
    res.status(500).json({ message: 'Failed to create order' })
  }
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 20, status } = req.query

    const query: any = {}
    if (status) query.status = status

    const orders = await Order.find(query)
      .populate('userId', 'name mobile email')
      .populate('productId', 'name slug')
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))

    const total = await Order.countDocuments(query)

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    })
  } catch (error) {
    console.error('Get orders error:', error)
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
}

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const order = await Order.findById(id)
      .populate('userId', 'name mobile email')
      .populate('productId', 'name slug images')

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json(order)
  } catch (error) {
    console.error('Get order error:', error)
    res.status(500).json({ message: 'Failed to fetch order' })
  }
}

export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .populate('productId', 'name slug images')
      .sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    console.error('Get my orders error:', error)
    res.status(500).json({ message: 'Failed to fetch orders' })
  }
}

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { status } = req.body

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }

    res.json({
      success: true,
      message: 'Order status updated',
      order
    })
  } catch (error) {
    console.error('Update order error:', error)
    res.status(500).json({ message: 'Failed to update order' })
  }
}
