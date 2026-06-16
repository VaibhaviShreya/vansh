import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'CORS test successful!',
    headers: req.headers,
    origin: req.headers.origin || 'no origin',
    method: req.method,
    timestamp: new Date().toISOString()
  })
})

router.post('/', (req, res) => {
  res.json({
    success: true,
    message: 'POST request successful!',
    data: req.body,
    origin: req.headers.origin || 'no origin',
    timestamp: new Date().toISOString()
  })
})

export default router