'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaEye, FaWhatsapp } from 'react-icons/fa'

const products = [
  {
    id: 1,
    name: 'GI Wire',
    slug: 'gi-wire',
    description: 'High-quality galvanized iron wire for construction and fencing applications.',
    category: 'Wire',
    moq: '500 KG',
  },
  {
    id: 2,
    name: 'Barbed Wire',
    slug: 'barbed-wire',
    description: 'Durable barbed wire for security fencing and boundary protection.',
    category: 'Fencing',
    moq: '500 KG',
  },
  {
    id: 3,
    name: 'Chain Link Fencing',
    slug: 'chain-link-fencing',
    description: 'Strong chain link fencing for industrial, residential, and commercial use.',
    category: 'Fencing',
    moq: '500 KG',
  },
  {
    id: 4,
    name: 'Wire Mesh',
    slug: 'wire-mesh',
    description: 'Versatile wire mesh for construction, screening, and industrial applications.',
    category: 'Mesh',
    moq: '500 KG',
  },
  {
    id: 5,
    name: 'Nails',
    slug: 'nails',
    description: 'Premium quality nails for all construction and woodworking needs.',
    category: 'Hardware',
    moq: '500 KG',
  },
  {
    id: 6,
    name: 'Binding Wire',
    slug: 'binding-wire',
    description: 'Flexible binding wire for construction, bundling, and tying applications.',
    category: 'Wire',
    moq: '500 KG',
  },
]

const FeaturedProducts = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary-navy mb-4">
            Our Premium Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of high-quality industrial wire and fencing products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg card-hover group"
            >
              <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-6xl">🔩</div>
                <div className="absolute top-4 right-4 bg-primary-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                  MOQ: {product.moq}
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    href={`/products/${product.slug}`}
                    className="bg-white text-primary-blue px-6 py-2 rounded-lg font-semibold hover:bg-primary-blue hover:text-white transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-primary-blue font-semibold mb-1">
                  {product.category}
                </div>
                <h3 className="text-xl font-bold text-primary-navy mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <Link
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-2 text-primary-blue font-semibold hover:text-blue-700 transition-colors"
                  >
                    <FaEye />
                    View Details
                  </Link>
                  <a
                    href={`https://wa.me/+916261758053?text=I'm%20interested%20in%20${product.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-600 transition-colors"
                  >
                    <FaWhatsapp size={20} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/products" className="btn-primary inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts