import multer from 'multer'
import { Request } from 'express'

const storage = multer.memoryStorage()

const fileFilter = (req: Request, file: any, cb: any) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only image files are allowed (JPEG, PNG, WEBP, GIF)'), false)
  }
}

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 5,
  },
  fileFilter: fileFilter,
})