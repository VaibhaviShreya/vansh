import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import { rateLimit } from 'express-rate-limit'
import { connectDB } from './config/database'
import { connectRedis } from './config/redis'
import apiRoutes from './routes'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-url.onrender.com', 'https://vansh-enterprises.vercel.app']
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}))
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/api', limiter)

// API Routes
app.use('/api', apiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    services: {
      api: 'running',
      mongodb: 'connected',
    },
    environment: process.env.NODE_ENV || 'development'
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Vansh Enterprises API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders'
    }
  })
})

// Error handler
app.use(errorHandler)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// Start server function
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB()
    console.log('✅ MongoDB connected successfully')
    
    // Connect to Redis (non-blocking)
    try {
      await connectRedis()
    } catch (error: any) {
      console.warn('⚠️ Redis connection warning:', error.message)
      console.log('✅ Using in-memory OTP storage as fallback')
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`)
      console.log(`📡 API: http://localhost:${PORT}/api`)
      console.log(`📡 Health: http://localhost:${PORT}/api/health`)
      console.log(`\n📊 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

export default app