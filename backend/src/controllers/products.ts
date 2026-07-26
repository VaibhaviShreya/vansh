import { Request, Response } from 'express'
import { Product } from '../models/Product'

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

// YOUR CLOUDINARY IMAGES - These will be used for all products
const CLOUDINARY_IMAGES: Record<string, string[]> = {
  'GI Wire': [
    'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565630/WhatsApp_Image_2026-06-13_at_23.38.29_xh55bn.jpg'
  ],
  'Barbed Wire': [
    'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/4_ahrycv.jpg'
  ],
  'Chain Link Fencing': [
    'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/6_w4ss2l.jpg'
  ],
  'Wire Mesh': [
    'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/7_w4ss2l.jpg'
  ],
  'Nails': [
    'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565628/5_x7pdmc.jpg'
  ],
  'Binding Wire': [
    'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565628/3_ohlqkt.jpg'
  ],
}

// Fallback image if product not found
const FALLBACK_IMAGE = 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565630/WhatsApp_Image_2026-06-13_at_23.38.29_xh55bn.jpg'

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query

    const query: any = { isActive: true }
    if (category) query.category = category
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    let products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 })

    // If no products, create default products with Cloudinary images
    if (products.length === 0) {
      const defaultProducts = [
        {
          name: 'GI Wire',
          slug: 'gi-wire',
          description: 'High-quality galvanized iron wire for construction and fencing. Corrosion-resistant and durable.',
          images: CLOUDINARY_IMAGES['GI Wire'],
          category: 'Wire',
          moq: 500,
          specifications: { Material: 'Galvanized Iron', Gauge: '8-16' },
          features: ['Corrosion Resistant', 'High Tensile Strength', 'Durable'],
          isActive: true
        },
        {
          name: 'Barbed Wire',
          slug: 'barbed-wire',
          description: 'Durable barbed wire for security fencing and boundary protection. Sharp barbs for maximum security.',
          images: CLOUDINARY_IMAGES['Barbed Wire'],
          category: 'Fencing',
          moq: 500,
          specifications: { Material: 'Galvanized Steel', BarbSpacing: '10-15 cm' },
          features: ['Sharp Barbs', 'High Security', 'Weather Resistant'],
          isActive: true
        },
        {
          name: 'Chain Link Fencing',
          slug: 'chain-link-fencing',
          description: 'Strong chain link fencing for industrial, residential, and commercial use.',
          images: CLOUDINARY_IMAGES['Chain Link Fencing'],
          category: 'Fencing',
          moq: 500,
          specifications: { Material: 'Galvanized Steel', MeshSize: '50-75 mm' },
          features: ['Strong Structure', 'Easy Installation', 'Low Maintenance'],
          isActive: true
        },
        {
          name: 'Wire Mesh',
          slug: 'wire-mesh',
          description: 'Versatile wire mesh for construction, screening, and industrial applications.',
          images: CLOUDINARY_IMAGES['Wire Mesh'],
          category: 'Mesh',
          moq: 500,
          specifications: { Material: 'Galvanized Steel', MeshSize: '10-100 mm' },
          features: ['Versatile Use', 'Strong', 'Corrosion Resistant'],
          isActive: true
        },
        {
          name: 'Nails',
          slug: 'nails',
          description: 'Premium quality nails for construction, woodworking, and industrial applications.',
          images: CLOUDINARY_IMAGES['Nails'],
          category: 'Hardware',
          moq: 500,
          specifications: { Material: 'Steel', Length: '25-150 mm' },
          features: ['Strong', 'Durable', 'Rust Resistant'],
          isActive: true
        },
        {
          name: 'Binding Wire',
          slug: 'binding-wire',
          description: 'Flexible binding wire for construction, bundling, and tying applications.',
          images: CLOUDINARY_IMAGES['Binding Wire'],
          category: 'Wire',
          moq: 500,
          specifications: { Material: 'Steel', Gauge: '8-16' },
          features: ['Flexible', 'Easy to Tie', 'Strong'],
          isActive: true
        }
      ]

      products = await Product.insertMany(defaultProducts)
      console.log('✅ Default products created with Cloudinary images')
    }

    const total = await Product.countDocuments(query)

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
        limit: Number(limit),
      },
    })
  } catch (error) {
    console.error('Get products error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch products' 
    })
  }
}

export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params
    const product = await Product.findOne({ slug, isActive: true })

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      })
    }

    res.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error('Get product error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch product' 
    })
  }
}

// Reset products with Cloudinary images
export const resetProducts = async (req: Request, res: Response) => {
  try {
    await Product.deleteMany({})
    
    const defaultProducts = [
      {
        name: 'GI Wire',
        slug: 'gi-wire',
        description: 'High-quality galvanized iron wire for construction and fencing.',
        images: CLOUDINARY_IMAGES['GI Wire'],
        category: 'Wire',
        moq: 500,
        specifications: { Material: 'Galvanized Iron', Gauge: '8-16' },
        features: ['Corrosion Resistant', 'High Tensile Strength'],
        isActive: true
      },
      {
        name: 'Barbed Wire',
        slug: 'barbed-wire',
        description: 'Durable barbed wire for security fencing and boundary protection.',
        images: CLOUDINARY_IMAGES['Barbed Wire'],
        category: 'Fencing',
        moq: 500,
        specifications: { Material: 'Galvanized Steel', BarbSpacing: '10-15 cm' },
        features: ['Sharp Barbs', 'High Security'],
        isActive: true
      },
      {
        name: 'Chain Link Fencing',
        slug: 'chain-link-fencing',
        description: 'Strong chain link fencing for industrial and residential use.',
        images: CLOUDINARY_IMAGES['Chain Link Fencing'],
        category: 'Fencing',
        moq: 500,
        specifications: { Material: 'Galvanized Steel', MeshSize: '50-75 mm' },
        features: ['Strong Structure', 'Easy Installation'],
        isActive: true
      },
      {
        name: 'Wire Mesh',
        slug: 'wire-mesh',
        description: 'Versatile wire mesh for construction and industrial applications.',
        images: CLOUDINARY_IMAGES['Wire Mesh'],
        category: 'Mesh',
        moq: 500,
        specifications: { Material: 'Galvanized Steel', MeshSize: '10-100 mm' },
        features: ['Versatile Use', 'Strong'],
        isActive: true
      },
      {
        name: 'Nails',
        slug: 'nails',
        description: 'Premium quality nails for construction and woodworking.',
        images: CLOUDINARY_IMAGES['Nails'],
        category: 'Hardware',
        moq: 500,
        specifications: { Material: 'Steel', Length: '25-150 mm' },
        features: ['Strong', 'Durable'],
        isActive: true
      },
      {
        name: 'Binding Wire',
        slug: 'binding-wire',
        description: 'Flexible binding wire for construction and tying applications.',
        images: CLOUDINARY_IMAGES['Binding Wire'],
        category: 'Wire',
        moq: 500,
        specifications: { Material: 'Steel', Gauge: '8-16' },
        features: ['Flexible', 'Easy to Tie'],
        isActive: true
      }
    ]

    const products = await Product.insertMany(defaultProducts)
    
    res.json({
      success: true,
      message: `Created ${products.length} products with Cloudinary images`,
      products
    })
  } catch (error) {
    console.error('Reset products error:', error)
    res.status(500).json({ success: false, message: 'Failed to reset products' })
  }
}