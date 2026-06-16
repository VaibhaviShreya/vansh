'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaSearch, FaEye, FaWhatsapp } from 'react-icons/fa'
import axios from 'axios'

interface Product {
  _id: string
  name: string
  slug: string
  description: string
  images: string[]
  category: string
  moq: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`)
      setProducts(response.data.products || response.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      // Use fallback data
      setProducts([
        {
          _id: '1',
          name: 'GI Wire',
          slug: 'gi-wire',
          description: 'High-quality galvanized iron wire for construction',
          images: ['/images/gi-wire.jpg'],
          category: 'Wire',
          moq: 500,
        },
        {
          _id: '2',
          name: 'Barbed Wire',
          slug: 'barbed-wire',
          description: 'Durable barbed wire for security fencing',
          images: ['/images/barbed-wire.jpg'],
          category: 'Fencing',
          moq: 500,
        },
        {
          _id: '3',
          name: 'Chain Link Fencing',
          slug: 'chain-link-fencing',
          description: 'Strong chain link fencing for industrial use',
          images: ['/images/chain-link.jpg'],
          category: 'Fencing',
          moq: 500,
        },
        {
          _id: '4',
          name: 'Wire Mesh',
          slug: 'wire-mesh',
          description: 'Versatile wire mesh for construction applications',
          images: ['/images/wire-mesh.jpg'],
          category: 'Mesh',
          moq: 500,
        },
        {
          _id: '5',
          name: 'Nails',
          slug: 'nails',
          description: 'Premium quality nails for construction',
          images: ['/images/nails.jpg'],
          category: 'Hardware',
          moq: 500,
        },
        {
          _id: '6',
          name: 'Binding Wire',
          slug: 'binding-wire',
          description: 'Flexible binding wire for construction',
          images: ['/images/binding-wire.jpg'],
          category: 'Wire',
          moq: 500,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = Array.from(new Set(products.map(p => p.category)))

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Our Products</h1>
          <p className="text-gray-600">Browse our complete range of premium industrial products</p>
        </motion.div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-6xl">🔩</div>
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    MOQ: {product.moq} KG
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Link
                      href={`/products/${product.slug}`}
                      className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 hover:text-white transition-colors flex items-center gap-2"
                    >
                      <FaEye /> View
                    </Link>
                    <a
                      href={`https://wa.me/919XXXXXXXXX?text=I'm%20interested%20in%20${product.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                    >
                      <FaWhatsapp /> Order
                    </a>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-blue-600 font-semibold mb-1">
                    {product.category}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}