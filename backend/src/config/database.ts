import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vansh_enterprises'

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
    console.log(`📁 Database: ${conn.connection.name}`)
    return conn
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error)
    process.exit(1)
  }
}

export default mongoose