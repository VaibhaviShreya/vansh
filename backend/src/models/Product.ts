import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  slug: string
  description: string
  images: string[]
  category: string
  moq: number
  specifications: Record<string, string>
  features: string[]
  isActive: boolean
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      default: ['https://via.placeholder.com/500x500'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    moq: {
      type: Number,
      required: [true, 'Minimum order quantity is required'],
      default: 500,
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    features: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Product = mongoose.model<IProduct>('Product', ProductSchema)