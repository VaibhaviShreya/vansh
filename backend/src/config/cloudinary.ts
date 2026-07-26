import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

export const defaultProductImages: Record<string, string> = {
  'GI Wire': 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565630/WhatsApp_Image_2026-06-13_at_23.38.29_xh55bn.jpg',
  'Barbed Wire': 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/4_ahrycv.jpg',
  'Chain Link Fencing': 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/6_w4ss2l.jpg',
  'Wire Mesh': 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/7_w4ss2l.jpg',
  Nails: 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565628/5_x7pdmc.jpg',
  'Binding Wire': 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565628/3_ohlqkt.jpg',
}

export const uploadToCloudinary = (buffer: Buffer, folder = 'vansh-products'): Promise<UploadApiResponse> => {
  if (!cloudName || !apiKey || !apiSecret) {
    return Promise.reject(new Error('Cloudinary credentials are not configured'))
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }, { width: 800, height: 600, crop: 'limit' }],
      },
      (error, result) => error || !result ? reject(error || new Error('Cloudinary returned no upload result')) : resolve(result)
    )
    stream.end(buffer)
  })
}

export const uploadMultipleToCloudinary = async (files: Express.Multer.File[], folder = 'vansh-products') => {
  const results = await Promise.all(files.map((file) => uploadToCloudinary(file.buffer, folder)))
  return results.map((result) => result.secure_url)
}

export const deleteFromCloudinary = (publicId: string) => cloudinary.uploader.destroy(publicId)

export default cloudinary
