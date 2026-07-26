import { createClient } from 'redis'

let client: any = null
let isConnected = false

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
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'
    console.log(`🔄 Connecting to Redis: ${redisUrl.substring(0, 30)}...`)
    
    client = createClient({
      url: redisUrl,
      socket: {
        reconnectStrategy: (retries: number) => {
          if (retries > 5) {
            console.log('Redis: Max reconnection attempts reached')
            return new Error('Max reconnection attempts')
          }
          return Math.min(retries * 100, 3000)
        },
        connectTimeout: 5000,
      },
    })

    client.on('error', (err: any) => {
      console.error('Redis Client Error:', err.message)
      isConnected = false
    })

    client.on('connect', () => {
      console.log('✅ Redis Connected')
      isConnected = true
    })

    await client.connect()
    isConnected = true
    console.log('✅ Redis connected successfully')
    return client
  } catch (error: any) {
    console.warn('⚠️ Redis connection failed. Using memory fallback:', error.message)
    isConnected = false
    const mockClient = new MockRedisClient()
    console.log('✅ Using in-memory OTP store (Redis fallback)')
    return mockClient
  }
}

export const setOTP = async (mobile: string, otp: string) => {
  try {
    const redis = getRedisClient()
    await redis.setEx(`otp:${mobile}`, 300, otp)
    console.log(`✅ OTP stored for ${mobile}`)
    return true
  } catch (error) {
    console.error('Error storing OTP:', error)
    return false
  }
}

export const getOTP = async (mobile: string): Promise<string | null> => {
  try {
    const redis = getRedisClient()
    return await redis.get(`otp:${mobile}`)
  } catch (error) {
    console.error('Error getting OTP:', error)
    return null
  }
}

export const deleteOTP = async (mobile: string) => {
  try {
    const redis = getRedisClient()
    await redis.del(`otp:${mobile}`)
    return true
  } catch (error) {
    console.error('Error deleting OTP:', error)
    return false
  }
}

export const getRedisClient = () => {
  if (!client) {
    return new MockRedisClient()
  }
  return client
}