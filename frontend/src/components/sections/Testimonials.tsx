'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaStar, FaStarHalfAlt, FaQuoteLeft } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'

const testimonials = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    company: 'RK Constructions',
    location: 'Mumbai',
    rating: 5,
    text: 'Vansh Enterprises has been our go-to supplier for GI wire and fencing materials. Their quality is unmatched and delivery is always on time.',
  },
  {
    id: 2,
    name: 'Priya Patel',
    company: 'Patel Hardware Store',
    location: 'Ahmedabad',
    rating: 5,
    text: 'We have been dealing with Vansh Enterprises for over 5 years. Their products are consistently high quality and their team is very professional.',
  },
  {
    id: 3,
    name: 'Suresh Reddy',
    company: 'Reddy Infra Projects',
    location: 'Hyderabad',
    rating: 4.5,
    text: 'Excellent quality barbed wire and chain link fencing. Very competitive rates and great customer service. Highly recommended for bulk orders.',
  },
  {
    id: 4,
    name: 'Anita Sharma',
    company: 'Sharma Distributors',
    location: 'Delhi',
    rating: 5,
    text: 'The best wholesale supplier for industrial hardware in North India. Reliable products, fair pricing, and prompt delivery every time.',
  },
]

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-primary-navy mb-4">
            What Our Clients Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Real feedback from our satisfied customers across India
          </p>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <FaQuoteLeft className="text-primary-blue/20 text-4xl mb-4" />
                <p className="text-gray-700 mb-4 italic">{testimonial.text}</p>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(testimonial.rating) ? (
                        <FaStar className="text-yellow-400" />
                      ) : i < testimonial.rating ? (
                        <FaStarHalfAlt className="text-yellow-400" />
                      ) : (
                        <FaStar className="text-gray-300" />
                      )}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="font-bold text-primary-navy">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.company}</p>
                  <p className="text-sm text-gray-400">{testimonial.location}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default Testimonials