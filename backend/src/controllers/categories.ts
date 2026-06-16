import { Request, Response } from 'express'
import { Category } from '../models/Category'

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find({ isActive: true })
    res.json(categories)
  } catch (error) {
    console.error('Get categories error:', error)
    res.status(500).json({ message: 'Failed to fetch categories' })
  }
}

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, icon } = req.body

    const category = new Category({
      name,
      slug: name.toLowerCase().replace(/ /g, '-'),
      description,
      icon
    })

    await category.save()

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category
    })
  } catch (error) {
    console.error('Create category error:', error)
    res.status(500).json({ message: 'Failed to create category' })
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const updates = req.body

    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    })

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json({
      success: true,
      message: 'Category updated successfully',
      category
    })
  } catch (error) {
    console.error('Update category error:', error)
    res.status(500).json({ message: 'Failed to update category' })
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const category = await Category.findByIdAndDelete(id)

    if (!category) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json({
      success: true,
      message: 'Category deleted successfully'
    })
  } catch (error) {
    console.error('Delete category error:', error)
    res.status(500).json({ message: 'Failed to delete category' })
  }
}