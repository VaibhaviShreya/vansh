'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaPhone, FaCheck, FaArrowLeft } from 'react-icons/fa'
import toast from 'react-hot-toast'
import axios from 'axios'

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
}

export default function ProductDetailsPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [mainImage, setMainImage] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        console.log(`📤 Fetching product: ${slug}`)
        
        // Correct API endpoint - using /slug/ route
        const response = await axios.get(`${API_URL}/products/slug/${slug}`)
        console.log('✅ Product response:', response.data)
        
        if (response.data.success && response.data.product) {
          setProduct(response.data.product)
          if (response.data.product.images && response.data.product.images.length > 0) {
            setMainImage(response.data.product.images[0])
          }
        } else {
          toast.error('Product not found')
          router.push('/products')
        }
      } catch (error: any) {
        console.error('❌ Failed to fetch product:', error)
        toast.error(error.response?.data?.message || 'Failed to load product')
        router.push('/products')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug, router])

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    )
  }

  // Handle product not found
  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600">Product not found</p>
          <Link href="/products" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <FaArrowLeft /> Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg bg-white">
              {mainImage ? (
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-8xl">🔩</span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {product.images.slice(1, 5).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setMainImage(img)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      mainImage === img 
                        ? 'border-blue-600 shadow-md' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain p-1"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="mb-4">
                <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                {product.name}
              </h1>
              
              <p className="text-gray-600 text-base mb-4 leading-relaxed">
                {product.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  MOQ: {product.moq} KG
                </span>
                <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  In Stock
                </span>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <FaCheck className="text-green-500 text-sm" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Specifications</h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-1">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                        <span className="text-gray-600">{key}</span>
                        <span className="font-medium text-slate-900">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-6">
                <a
                  href={`https://wa.me/916261758053?text=I'm%20interested%20in%20${product.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <FaWhatsapp /> Order via WhatsApp
                </a>
                <a
                  href="tel:+916261758053"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <FaPhone style={{ transform: 'scaleX(-1)' }}/> Call Now
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}