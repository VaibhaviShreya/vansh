'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaWhatsapp, FaPhone, FaUserPlus } from 'react-icons/fa'

const CTASection = () => {
  return (
    <section className="py-20 gradient-dark">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Place Your Bulk Order?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust Vansh Enterprises for their wire and fencing needs
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="https://wa.me/+916261758053"
                target="_blank"
                className="block bg-green-500 hover:bg-green-600 text-white p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaWhatsapp className="text-3xl mx-auto mb-3" />
                <h3 className="text-lg font-bold">WhatsApp Order</h3>
                <p className="text-sm">Quick & Easy</p>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="/register"
                className="block bg-primary-blue hover:bg-blue-700 text-white p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaUserPlus className="text-3xl mx-auto mb-3" />
                <h3 className="text-lg font-bold">Register Now</h3>
                <p className="text-sm">Become a Dealer</p>
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link
                href="tel:++916261758053"
                className="block bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <FaPhone className="text-3xl mx-auto mb-3" />
                <h3 className="text-lg font-bold">Call Sales Team</h3>
                <p className="text-sm">Talk to Expert</p>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CTASection