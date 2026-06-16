import { createClient } from 'redis'

let client: any = null
let isConnected = false

// Mock Redis client for fallback
class MockRedisClient {
  private store: Map<string, { value: string; expires: number }> = new Map()

  async setEx(key: string, seconds: number, value: string) {
    this.store.set(key, {
      value,
      expires: Date.now() + seconds * 1000
    })
    return 'OK'
  }

  async get(key: string): Promise<string | null> {
    const data = this.store.get(key)
    if (!data) return null
    if (Date.now() > data.expires) {
      this.store.delete(key)
      return null
    }
    return data.value
  }

  async del(key: string) {
    this.store.delete(key)
    return 1
  }

  on() {}
  get isOpen() { return true }
  get isReady() { return true }
}

export const connectRedis = async () => {
  try {
    // Use your Redis Cloud credentials
    const redisUrl = process.env.REDIS_URL || 'redis://default:4y7emg6dg5gukS5fi2VjLtd2ZFKdadTN@exquisite-ultrafast-blush-58315.db.redis.io:18624'
    
    console.log(`🔄 Connecting to Redis Cloud...`)
    
    client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 10) {
            console.log('Redis: Max reconnection attempts reached')
            return new Error('Max reconnection attempts')
          }
          return Math.min(retries * 100, 3000)
        },
        connectTimeout: 10000,
      },
    })

    client.on('error', (err: any) => {
      console.error('Redis Client Error:', err.message)
      isConnected = false
    })

    client.on('connect', () => {
      console.log('✅ Redis Cloud Connected')
      isConnected = true
    })

    client.on('ready', () => {
      console.log('✅ Redis Cloud Ready')
      isConnected = true
    })

    client.on('reconnecting', () => {
      console.log('🔄 Redis Cloud Reconnecting...')
    })

    await client.connect()
    isConnected = true
    console.log('✅ Redis Cloud connected successfully')
    return client
  } catch (error: any) {
    console.warn('⚠️ Redis Cloud connection failed. Using memory fallback:', error.message)
    isConnected = false
    const mockClient = new MockRedisClient()
    console.log('✅ Using in-memory OTP store (Redis fallback)')
    return mockClient
  }
}

export const getRedisClient = () => {
  if (!client) {
    console.warn('Redis client not initialized, using memory fallback')
    return new MockRedisClient()
  }
  return client
}

export const setOTP = async (mobile: string, otp: string) => {
  try {
    const redis = getRedisClient()
    const key = `otp:${mobile}`
    await redis.setEx(key, 300, otp) // 5 minutes expiry
    console.log(`✅ OTP stored in Redis Cloud for ${mobile}`)
    return true
  } catch (error) {
    console.error('Error storing OTP:', error)
    return false
  }
}

export const getOTP = async (mobile: string): Promise<string | null> => {
  try {
    const redis = getRedisClient()
    const key = `otp:${mobile}`
    const otp = await redis.get(key)
    if (otp) {
      console.log(`📥 OTP retrieved for ${mobile}`)
    } else {
      console.log(`📥 No OTP found for ${mobile}`)
    }
    return otp
  } catch (error) {
    console.error('Error getting OTP:', error)
    return null
  }
}

export const deleteOTP = async (mobile: string) => {
  try {
    const redis = getRedisClient()
    const key = `otp:${mobile}`
    await redis.del(key)
    console.log(`🗑️ OTP deleted for ${mobile}`)
    return true
  } catch (error) {
    console.error('Error deleting OTP:', error)
    return false
  }
}