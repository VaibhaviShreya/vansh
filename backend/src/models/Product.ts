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
  sku?: string // Make sku optional
  createdAt: Date
  updatedAt: Date
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
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    moq: {
      type: Number,
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
    sku: {
      type: String,
      trim: true,
      // Remove unique: true to avoid duplicate errors
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
)

// Remove the unique index on sku if it exists
// ProductSchema.index({ sku: 1 }, { unique: true, sparse: true });

export const Product = mongoose.model<IProduct>('Product', ProductSchema)