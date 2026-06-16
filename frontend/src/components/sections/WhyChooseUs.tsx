'use client'

import { motion } from 'framer-motion'
import { FaShieldAlt, FaTruck, FaAward, FaClock, FaUsers, FaHandshake } from 'react-icons/fa'

const WhyChooseUs = () => {
  const features = [
    {
      icon: FaShieldAlt,
      title: 'Premium Quality',
      description: 'All products meet international quality standards with rigorous testing.',
    },
    {
      icon: FaTruck,
      title: 'Pan India Delivery',
      description: 'Fast and reliable delivery across all states and union territories.',
    },
    {
      icon: FaAward,
      title: 'Trusted Since 2010',
      description: 'Over a decade of experience serving India\'s industrial needs.',
    },
    {
      icon: FaClock,
      title: 'Timely Delivery',
      description: 'Committed to on-time delivery with efficient logistics management.',
    },
    {
      icon: FaUsers,
      title: 'Customer First',
      description: 'Dedicated support team to assist you at every step.',
    },
    {
      icon: FaHandshake,
      title: 'Bulk Orders Welcome',
      description: 'Special pricing and priority handling for bulk and wholesale orders.',
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary-navy mb-4">
            Why Choose Vansh Enterprises?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are committed to providing the best quality products and services to our customers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8 text-center card-hover"
            >
              <div className="w-16 h-16 bg-primary-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-primary-blue text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-primary-navy mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs