import express from 'express'

const router = express.Router()

// Public routes
router.get('/', (req, res) => {
  res.json({ 
    success: true,
    categories: [
      { id: '1', name: 'Wire', slug: 'wire' },
      { id: '2', name: 'Fencing', slug: 'fencing' },
      { id: '3', name: 'Hardware', slug: 'hardware' },
      { id: '4', name: 'Mesh', slug: 'mesh' }
    ]
  })
})

export default router