import { Request, Response } from 'express'
import { User } from '../models/User'
import {Product} from '../models/Product'
import { Order } from '../models/Order'

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      revenue
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$quantity' } } }
      ])
    ])

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      pendingOrders,
      revenue: revenue[0]?.total || 0
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    res.status(500).json({ message: 'Failed to fetch dashboard stats' })
  }
}

export const getRecentOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name mobile')
      .populate('productId', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10)

    res.json(orders)
  } catch (error) {
    console.error('Recent orders error:', error)
    res.status(500).json({ message: 'Failed to fetch recent orders' })
  }
}

export const getAnalytics = async (req: Request, res: Response) => {
  try {
    const [monthlyOrders, topProducts] = await Promise.all([
      Order.aggregate([
        {
          $group: {
            _id: {
              month: { $month: '$createdAt' },
              year: { $year: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),
      Order.aggregate([
        { $group: { _id: '$productId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        { $project: { name: '$product.name', count: 1 } }
      ])
    ])

    res.json({
      monthlyOrders,
      topProducts
    })
  } catch (error) {
    console.error('Analytics error:', error)
    res.status(500).json({ message: 'Failed to fetch analytics' })
  }
}