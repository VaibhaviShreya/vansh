import { uploadToCloudinary, defaultProductImages } from '../config/cloudinary'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const testCloudinary = async () => {
  try {
    console.log('🔍 Testing Cloudinary Upload...')
    
    // Upload a test image
    const testImagePath = path.join(__dirname, 'test-image.jpg')
    
    if (fs.existsSync(testImagePath)) {
      const buffer = fs.readFileSync(testImagePath)
      const result = await uploadToCloudinary(buffer, 'test')
      console.log('✅ Upload successful!')
      console.log('📸 Image URL:', result.secure_url)
    } else {
      console.log('📝 Test image not found, using default image URL')
      console.log('📸 Default image URL:', defaultProductImages['GI Wire'])
    }
    
    console.log('\n✅ Cloudinary test completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error)
    process.exit(1)
  }
}

testCloudinary()