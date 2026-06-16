import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import { rateLimit } from 'express-rate-limit'
import authRoutes from './routes/auth'
import productRoutes from './routes/products'
// import orderRoutes from './routes/orders'
// import categoryRoutes from './routes/categories'
// import userRoutes from './routes/users'
// import adminRoutes from './routes/admin'
import { connectRedis } from './config/redis'
import { errorHandler } from './middleware/errorHandler'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

// Middleware
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use('/api', limiter)

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
// app.use('/api/orders', orderRoutes)
// app.use('/api/categories', categoryRoutes)
// app.use('/api/users', userRoutes)
// app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handler
app.use(errorHandler)

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vansh_enterprises')
  .then(() => {
    console.log('✅ Connected to MongoDB')
    // Connect to Redis
    return connectRedis()
  })
  .then(() => {
    console.log('✅ Connected to Redis')
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('❌ Failed to connect to database:', error)
    process.exit(1)
  })

export default app