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
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
)

export const Product = mongoose.model<IProduct>('Product', ProductSchema)