'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImageProps {
  src?: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export default function ProductImage({ 
  src, 
  alt, 
  width = 400, 
  height = 400, 
  className = '',
  priority = false
}: ProductImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  // Use fallback if image fails to load
  const imageUrl = error 
    ? `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(alt)}`
    : src || `https://via.placeholder.com/${width}x${height}?text=${encodeURIComponent(alt)}`

  return (
    <div className={`relative overflow-hidden bg-gray-100 ${className}`} style={{ width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <span className="text-gray-400 text-sm">Loading...</span>
        </div>
      )}
      
      <Image
        src={imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={`object-cover transition-opacity duration-300 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
        priority={priority}
        unoptimized={false}
      />
    </div>
  )
}