import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import { rateLimit } from 'express-rate-limit'
import { connectDB } from './config/database'
import apiRoutes from './routes'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// CORS Configuration
const allowedOrigins = [
  'https://vansh-beta.vercel.app',
  'https://vansh-beta-control-check.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'https://vansh-0kyd.onrender.com',
]

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true)
    } else {
      console.log('❌ CORS blocked for origin:', origin)
      callback(null, true) // Allow all for testing
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}))

app.options('*', cors())

// Additional CORS headers
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin)
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
  }
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }
  next()
})

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}))
app.use(compression())
app.use(morgan('dev'))
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
    environment: process.env.NODE_ENV || 'development',
    cors: {
      allowedOrigins: allowedOrigins,
      currentOrigin: req.headers.origin || 'none',
    }
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Vansh Enterprises API',
    version: '1.0.0',
    status: 'running'
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

// Start server
const startServer = async () => {
  try {
    await connectDB()
    console.log('✅ MongoDB connected successfully')
    
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`)
      console.log(`📡 API: http://localhost:${PORT}/api`)
      console.log(`📡 Health: http://localhost:${PORT}/api/health`)
      console.log(`\n🔒 Environment: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer()

export default app