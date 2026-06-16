'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaPhone, FaCheck, FaTruck, FaShieldAlt } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'
import axios from 'axios'

const ProductDetails = () => {
  const { slug } = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [orderForm, setOrderForm] = useState({
    name: '',
    mobile: '',
    company: '',
    quantity: '500',
    city: '',
    message: '',
  })

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated) {
      toast.error('Please login to view product details')
      router.push(`/login?redirect=/products/${slug}`)
      return
    }

    // Fetch product data
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`)
        setProduct(response.data)
      } catch (error) {
        toast.error('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug, isAuthenticated, router])

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (parseInt(orderForm.quantity) < 500) {
      toast.error('Minimum order quantity is 500 KG')
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        ...orderForm,
        productId: product._id,
        userId: user?.id,
      })
      toast.success('Order placed successfully!')
      // WhatsApp message
      const message = `Order: ${product.name}\nQuantity: ${orderForm.quantity} KG\nCompany: ${orderForm.company}\nCity: ${orderForm.city}`
      window.open(`https://wa.me/919XXXXXXXXX?text=${encodeURIComponent(message)}`, '_blank')
    } catch (error) {
      toast.error('Failed to place order')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Product not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={product.images?.[0] || '/images/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images?.slice(1, 5).map((img: string, index: number) => (
                <div key={index} className="relative h-20 rounded-lg overflow-hidden">
                  <Image src={img} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
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
            <h1 className="text-4xl font-bold text-primary-navy mb-2">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-4">{product.description}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-primary-blue text-white px-4 py-1 rounded-full text-sm font-semibold">
                MOQ: {product.moq || '500 KG'}
              </span>
              <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                In Stock
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {['Premium Quality', 'Bulk Supply Available', 'Pan India Delivery', 'Competitive Rates'].map(
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
              <h3 className="text-xl font-bold text-primary-navy">Place Your Order</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name *"
                  required
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                <input
                  type="tel"
                  placeholder="Mobile Number *"
                  required
                  value={orderForm.mobile}
                  onChange={(e) => setOrderForm({ ...orderForm, mobile: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                <input
                  type="text"
                  placeholder="Company Name"
                  value={orderForm.company}
                  onChange={(e) => setOrderForm({ ...orderForm, company: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
                <input
                  type="number"
                  placeholder="Quantity (KG) *"
                  required
                  min="500"
                  value={orderForm.quantity}
                  onChange={(e) => setOrderForm({ ...orderForm, quantity: e.target.value })}
                  className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                />
              </div>
              <input
                type="text"
                placeholder="City *"
                required
                value={orderForm.city}
                onChange={(e) => setOrderForm({ ...orderForm, city: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />
              <textarea
                placeholder="Message (Optional)"
                rows={3}
                value={orderForm.message}
                onChange={(e) => setOrderForm({ ...orderForm, message: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
              />

              <div className="flex flex-wrap gap-4">
                <button type="submit" className="btn-primary">
                  Place Order
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const message = `Order: ${product.name}\nQuantity: ${orderForm.quantity} KG\nCompany: ${orderForm.company}\nCity: ${orderForm.city}`
                    window.open(`https://wa.me/919XXXXXXXXX?text=${encodeURIComponent(message)}`, '_blank')
                  }}
                  className="btn-whatsapp flex items-center gap-2"
                >
                  <FaWhatsapp />
                  WhatsApp Order
                </button>
                <button
                  type="button"
                  onClick={() => window.open('tel:+919XXXXXXXXX')}
                  className="btn-outline flex items-center gap-2"
                >
                  <FaPhone />
                  Call Sales Team
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails