'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FaWhatsapp, FaEye } from 'react-icons/fa'
import axios from 'axios'
import toast from 'react-hot-toast'

 interface Product {
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`)
      console.log('Products response:', response.data)
      setProducts(response.data.products || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header - Added better padding and spacing */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 md:mb-4">
            Our Products
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto px-4">
            Browse our complete range of premium industrial products
          </p>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <div 
                key={product._id} 
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Product Image - Fixed aspect ratio */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      priority={false}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                        const fallback = target.parentElement?.querySelector('.image-fallback')
                        if (fallback) fallback.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <div className="image-fallback hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                    <span className="text-6xl">🔩</span>
                  </div>
                  
                  {/* MOQ Badge - Fixed position and styling */}
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg z-10">
                    MOQ: {product.moq} KG
                  </div>
                  
                  {/* Hover Overlay - Better button styling */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2 text-sm md:text-base"
                    >
                      <FaEye className="text-sm" /> View
                    </Link>
                    <a
                      href={`https://wa.me/916261758053?text=I'm%20interested%20in%20${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2 text-sm md:text-base"
                    >
                      <FaWhatsapp className="text-sm" /> Order
                    </a>
                  </div>
                </div>
                
                {/* Product Info - Better spacing */}
                <div className="p-4 md:p-5">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-blue-600 font-semibold uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 mt-1 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  
                  {/* Quick Action */}
                  <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {product.features?.length || 0} features
                    </span>
                    <Link
                      href={`/products/${product.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
                    >
                      Learn More →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}