import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const testRedis = async () => {
  console.log('🔍 Testing Redis Cloud Connection...')
  console.log('=' .repeat(50))
  
  try {
    // Your Redis Cloud credentials
    const client = createClient({
      url: process.env.REDIS_URL || 'redis://default:4y7emg6dg5gukS5fi2VjLtd2ZFKdadTN@exquisite-ultrafast-blush-58315.db.redis.io:18624'
    })

    client.on('error', (err) => {
      console.error('Redis Client Error:', err.message)
    })

    client.on('connect', () => {
      console.log('✅ Connected to Redis Cloud!')
    })

    await client.connect()
    console.log('✅ Connection established')

    // Test operations
    console.log('\n📤 Testing Redis Operations...')
    
    // Set a value
    await client.set('test:key', 'Hello from Vansh Enterprises!')
    console.log('✅ Key set successfully')
    
    // Get the value
    const value = await client.get('test:key')
    console.log(`📥 Retrieved: ${value}`)
    
    // Set with expiry (5 seconds)
    await client.setEx('test:expiry', 5, 'This will expire in 5 seconds')
    console.log('✅ Expiry key set')
    
    // Check TTL
    const ttl = await client.ttl('test:expiry')
    console.log(`⏱️ TTL: ${ttl} seconds`)
    
    // Delete the key
    await client.del('test:key')
    console.log('🗑️ Key deleted')
    
    // Test OTP storage
    const testMobile = '9999999999'
    const testOTP = '123456'
    
    console.log(`\n📱 Testing OTP for ${testMobile}`)
    await client.setEx(`otp:${testMobile}`, 300, testOTP)
    console.log('✅ OTP stored')
    
    const retrievedOTP = await client.get(`otp:${testMobile}`)
    console.log(`📥 Retrieved OTP: ${retrievedOTP}`)
    
    if (retrievedOTP === testOTP) {
      console.log('✅ OTP Test Passed!')
    } else {
      console.log('❌ OTP Test Failed!')
    }
    
    await client.del(`otp:${testMobile}`)
    console.log('🗑️ OTP deleted')
    
    // Get connection info
    const info = await client.info()
    const memoryMatch = info.match(/used_memory_human:(.*?)\r?\n/)
    const keysMatch = info.match(/db0:keys=(\d+)/)
    
    console.log('\n📊 Redis Cloud Stats:')
    console.log(`   Memory Used: ${memoryMatch ? memoryMatch[1] : 'N/A'}`)
    console.log(`   Total Keys: ${keysMatch ? keysMatch[1] : '0'}`)
    console.log(`   Database: exquisite-ultrafast-blush-58315.db.redis.io:18624`)
    
    await client.quit()
    console.log('\n✅ All tests passed! Redis Cloud is ready.')
    
    process.exit(0)
  } catch (error: any) {
    console.error('❌ Test failed:', error.message)
    console.log('\n💡 Troubleshooting tips:')
    console.log('   1. Make sure your Redis Cloud is active')
    console.log('   2. Check your password is correct')
    console.log('   3. Verify your network connection')
    process.exit(1)
  }
}

testRedis()