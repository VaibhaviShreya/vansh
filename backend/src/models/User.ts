import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUser extends Document {
  name: string
  mobile: string
  email?: string
  password: string
  role: 'user' | 'admin'
  isVerified: boolean
  otpVerified: boolean
  loginCount: number
  lastLogin: Date
  loginHistory: {
    timestamp: Date
    ipAddress?: string
    userAgent?: string
    device?: string
  }[]
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
      default: ''
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      // ✅ REMOVE unique: true
      // ✅ REMOVE sparse: true
      // Just keep it simple
      default: undefined,
    },
    password: {
      type: String,
      required: false,
      default: ''
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    loginCount: {
      type: Number,
      default: 0,
    },
    lastLogin: {
      type: Date,
    },
    loginHistory: {
      type: [{
        timestamp: {
          type: Date,
          default: Date.now,
        },
        ipAddress: {
          type: String,
        },
        userAgent: {
          type: String,
        },
        device: {
          type: String,
        },
      }],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

// Only hash password if it exists and is modified
UserSchema.pre('save', async function (next) {
  if (!this.password || !this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model<IUser>('User', UserSchema)