import mongoose, { Schema, Document } from 'mongoose'

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  quantity: number
  companyName: string
  city: string
  message?: string
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  mobile: string
  name: string
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [500, 'Minimum order quantity is 500 KG'],
    },
    companyName: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending',
    },
    mobile: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Order = mongoose.model<IOrder>('Order', OrderSchema)