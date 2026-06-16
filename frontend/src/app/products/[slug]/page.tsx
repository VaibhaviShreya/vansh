'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaPhone, FaCheck, FaArrowLeft } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
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
  const { isAuthenticated } = useAuth()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [orderForm, setOrderForm] = useState({
    name: '',
    mobile: '',
    company: '',
    quantity: '500',
    city: '',
    message: '',
  })

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view product details')
      router.push(`/login?redirect=/products/${slug}`)
      return
    }
  }, [isAuthenticated, router, slug])

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`)
        setProduct(response.data)
      } catch (error) {
        console.error('Failed to fetch product:', error)
        // Fallback data
        setProduct({
          _id: '1',
          name: slug?.toString().replace(/-/g, ' ') || 'Product',
          slug: slug?.toString() || '',
          description: 'Premium quality product for industrial use',
          images: [],
          category: 'Industrial',
          moq: 500,
          specifications: {
            'Material': 'High Quality',
            'Finish': 'Standard',
          },
          features: ['Durable', 'High Quality', 'Bulk Supply Available'],
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchProduct()
    }
  }, [slug, isAuthenticated])

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (parseInt(orderForm.quantity) < 500) {
      toast.error('Minimum order quantity is 500 KG')
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        ...orderForm,
        productId: product?._id,
      })
      toast.success('Order placed successfully!')
      
      // WhatsApp message
      const message = `Order: ${product?.name}\nQuantity: ${orderForm.quantity} KG\nCompany: ${orderForm.company}\nCity: ${orderForm.city}`
      window.open(`https://wa.me/919XXXXXXXXX?text=${encodeURIComponent(message)}`, '_blank')
    } catch (error) {
      toast.error('Failed to place order')
    }
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
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
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
              <div className="text-8xl">🔩</div>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="relative h-20 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl">🔩</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 mb-2">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOQ: {product.moq} KG
              </span>
              <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                In Stock
              </span>
            </div>

            {/* Specifications */}
            <div className="bg-white rounded-xl p-6 shadow-md mb-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Specifications</h3>
              <div className="space-y-2">
                {Object.entries(product.specifications || {}).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {(product.features || ['Premium Quality', 'Bulk Supply Available', 'Pan India Delivery']).map(
                (feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCheck className="text-green-500" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                )
              )}
            </div>

            {/* Order Form */}
            <form onSubmit={handleOrderSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-slate-900">Place Your Order</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number *"
                  required
                  value={orderForm.mobile}
                  onChange={(e) => setOrderForm({ ...orderForm, mobile: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={orderForm.company}
                  onChange={(e) => setOrderForm({ ...orderForm, company: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Quantity (KG) *"
                  required
                  min="500"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="text"
                placeholder="City *"
                required
                value={orderForm.city}
                onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                placeholder="Message (Optional)"
                rows={3}
                value={orderForm.message}
                onChange={(e) => setOrderForm({ ...orderForm, message: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex flex-wrap gap-4">
                <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300">
                  Place Order
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const message = `Order: ${product.name}\nQuantity: ${orderForm.quantity} KG\nCompany: ${orderForm.company}\nCity: ${orderForm.city}`
                    window.open(`https://wa.me/919XXXXXXXXX?text=${encodeURIComponent(message)}`, '_blank')
                  }}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 flex items-center gap-2"
                >
                  <FaWhatsapp /> WhatsApp Order
                </button>
                <button
                  type="button"
                  onClick={() => window.open('tel:+919XXXXXXXXX')}
                  className="border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center gap-2"
                >
                  <FaPhone /> Call Sales
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}