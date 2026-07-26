import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authorized, no token' 
      })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string
      role: string
    }

    const user = await User.findById(decoded.id).select('-password')
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      })
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ 
      success: false,
      message: 'Not authorized, invalid token' 
    })
  }
}

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    res.status(403).json({ 
      success: false,
      message: 'Admin access required' 
    })
  }
}