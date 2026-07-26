export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  images: string[]
  category: string
  moq: number
  specifications: Record<string, string>
  features: string[]
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}