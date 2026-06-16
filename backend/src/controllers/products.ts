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

    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 })

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

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, category, moq, specifications, features } = req.body

    const product = new Product({
      name,
      slug: slugify(name),
      description,
      images: ['https://via.placeholder.com/500x500'],
      category,
      moq: moq || 500,
      specifications: typeof specifications === 'string' ? JSON.parse(specifications) : specifications || {},
      features: typeof features === 'string' ? JSON.parse(features) : features || [],
      isActive: true,
    })

    await product.save()

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to create product' 
    })
  }
}
// Update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    // Handle image uploads
    const files = req.files as Express.Multer.File[]
    if (files && files.length > 0) {
      // In a real implementation, upload to Cloudinary here
      const imageUrls = files.map(() => 'https://via.placeholder.com/500x500')
      updates.images = imageUrls
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      })
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    })
  } catch (error) {
    console.error('Update product error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to update product' 
    })
  }
}

// Delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const product = await Product.findByIdAndDelete(id)

    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      })
    }

    res.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    console.error('Delete product error:', error)
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete product' 
    })
  }
}