import Redis from 'redis'

let client: Redis.RedisClientType

export const connectRedis = async () => {
  client = Redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  })

  client.on('error', (err) => console.error('Redis Client Error', err))
  client.on('connect', () => console.log('Redis Client Connected'))

  await client.connect()
  return client
}

export const getRedisClient = () => {
  if (!client) {
    throw new Error('Redis client not initialized')
  }
  return client
}

export const setOTP = async (mobile: string, otp: string) => {
  const key = `otp:${mobile}`
  await client.setEx(key, 300, otp) // 5 minutes expiry
}

export const getOTP = async (mobile: string): Promise<string | null> => {
  const key = `otp:${mobile}`
  return await client.get(key)
}

export const deleteOTP = async (mobile: string) => {
  const key = `otp:${mobile}`
  await client.del(key)
}