'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FaWhatsapp, FaPhone, FaTruck, FaShieldAlt, FaUsers, FaStore } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const Hero = () => {
 const productImages = [
    { 
        src: 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565628/3_ohlqkt.jpg', 
        alt :'Barbed Wire Rolls',
        
    },
    { 
        src: 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565629/4_ahrycv.jpg', 
        alt :'Chain Link Fencing Rolls',
      
    },
    { 
        src: 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1785064842/Nariyal_rassi_ususpt.jpg', 
        alt: 'Nariyal Rassi',
    },
   
    { 
        src: 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1781565628/5_x7pdmc.jpg',
        alt: 'Nails', 
      
    },
    { 
        src: 'https://res.cloudinary.com/ddtwc9qh4/image/upload/v1785064843/Gi_Reti_jali_vwkefv.jpg', 
        alt: 'GI Reti Jali',
    },
]

  const stats = [
    { icon: FaUsers, value: '10,000+', label: 'Happy Customers' },
    { icon: FaStore, value: '500+', label: 'Dealers' },
    { icon: FaTruck, value: 'Pan India', label: 'Supply' },
    { icon: FaShieldAlt, value: '100%', label: 'Quality Assured' },
  ]

  return (
    <section className="gradient-dark min-h-screen pt-20 overflow-hidden">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image Slider */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 lg:order-1"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                navigation={true}
                className="h-[400px] md:h-[500px]"
                loop={true}
              >
                {productImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="relative w-full h-full bg-gray-800">
                      {/* Placeholder image - replace with actual images */}<Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={index === 0}
                        quality={90}
                      />
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
                        <div className="text-center text-white p-4">
                          <div className="text-6xl mb-4">🔩</div>
                          <p className="text-xl font-semibold">{image.alt}</p>
                          <p className="text-sm text-gray-300 mt-2">Premium Quality</p>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <p className="text-white text-lg font-semibold">{image.alt}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-2 text-white space-y-6"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-green-400 text-sm font-semibold">✦</span>
              <span className="ml-2 text-sm font-medium">
                India's Trusted Wire & Fencing Supplier Since 2010
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-primary-blue">Vansh</span>
              <span className="text-white"> Enterprises</span>
            </h1>

            <h2 className="text-2xl md:text-3xl font-semibold text-blue-300">
              Premium Wire & Fencing Solutions for Bulk Orders
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed">
              Supplying high-quality GI Wire, Barbed Wire, Chain Link Fencing, Wire Mesh, 
              Nails, and Industrial Hardware at competitive wholesale rates across India. 
              Reliable products, bulk supply, and timely delivery.
            </p>

            {/* Highlight Badges */}
            <div className="flex flex-wrap gap-3">
              {['MOQ: 500 KG', 'Pan India Delivery', 'Bulk Orders Welcome', 'Trusted Quality'].map(
                (badge, index) => (
                  <span
                    key={index}
                    className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/20"
                  >
                    {badge}
                  </span>
                )
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="https://wa.me/916261758053"
                target="_blank"
                className="btn-whatsapp flex items-center gap-2 px-6 py-3"
              >
                <FaWhatsapp size={20} />
                WhatsApp Us
              </Link>
              <Link
                href="tel:+916261758053"
                 className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <FaPhone size={18} className="flex-shrink-0" style={{ transform: 'scaleX(-1)' }}/>
                <span>Call Now</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/10">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <stat.icon className="text-primary-blue text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero