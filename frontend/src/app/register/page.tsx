'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { FaUser, FaPhone, FaLock, FaEnvelope, FaArrowRight, FaSpinner, FaCheckCircle } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    otp: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [verification, setVerification] = useState<{ userId: string; token: string } | null>(null)
  const [timer, setTimer] = useState(0)
  const router = useRouter()
  const { sendOTP, verifyOTP, register, resendOTP } = useAuth()

  // OTP Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [timer])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const mobile = formData.mobile.replace(/\D/g, '')
    if (mobile.length !== 10) {
      toast.error('Please enter a valid 10-digit mobile number')
      return
    }

    setIsLoading(true)
    try {
      await sendOTP(mobile)
      setFormData((current) => ({ ...current, mobile, otp: '' }))
      setStep(2)
      setTimer(60)
      toast.success('OTP sent to your mobile number!')
    } catch (error: any) {
      console.error('Send OTP error:', error)
      toast.error(error.message || 'Failed to send OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!/^\d{6}$/.test(formData.otp)) {
      toast.error('Please enter a valid 6-digit OTP')
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyOTP(formData.mobile, formData.otp, formData.name.trim())
      if (!result.userId || !result.token) throw new Error('OTP verification did not return a registration session')
      setVerification(result)
      setStep(3)
      toast.success('OTP verified successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Invalid OTP. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.password || !verification) {
      toast.error('Please fill in all fields')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      await register({
        userId: verification.userId,
        password: formData.password,
        verificationToken: verification.token,
        name: formData.name.trim()
      })
      // Registration success - redirect handled in useAuth
    } catch (error: any) {
      console.error('Registration error:', error)
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (timer > 0) {
      toast.error(`Please wait ${timer} seconds before resending`)
      return
    }
    
    setIsLoading(true)
    try {
      await resendOTP(formData.mobile)
      setTimer(60)
      toast.success('OTP resent successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend OTP')
    } finally {
      setIsLoading(false)
    }
  }

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaUser className="text-2xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
          <p className="text-gray-600 mt-2">
            {step === 1 && 'Enter your mobile number to get started'}
            {step === 2 && 'Enter the OTP sent to your mobile'}
            {step === 3 && 'Create your account password'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    s <= step ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s < step ? <FaCheckCircle className="text-white" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 transition-all duration-300 ${
                      s < step ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Mobile Number */}
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" style={{ transform: 'scaleX(-1)' }} />
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">We'll send a 6-digit OTP to this number</p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Sending OTP...
                </>
              ) : (
                <>
                  Send OTP
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>
        )}

        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl tracking-widest transition-all"
                  required
                  disabled={isLoading}
                  autoFocus
                />
              </div>
              <div className="flex justify-between items-center mt-2">
                <p className="text-sm text-gray-500">
                  OTP sent to {formData.mobile}
                </p>
                {timer > 0 && (
                  <span className="text-sm text-blue-600 font-semibold">
                    {formatTime(timer)}
                  </span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Verify OTP
                  <FaArrowRight />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading || timer > 0}
              className={`w-full text-center font-semibold text-sm transition-all ${
                timer > 0 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:text-blue-700'
              }`}
            >
              {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : 'Resend OTP'}
            </button>
          </form>
        )}

        {/* Step 3: Create Password */}
        {step === 3 && (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Create Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Confirm your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className="mt-2">
                <div className="flex items-center gap-2">
                  <div className={`flex-1 h-1 rounded-full ${
                    formData.password.length < 4 ? 'bg-red-400' :
                    formData.password.length < 6 ? 'bg-yellow-400' :
                    'bg-green-400'
                  }`} />
                  <span className="text-xs text-gray-500">
                    {formData.password.length < 4 ? 'Weak' :
                     formData.password.length < 6 ? 'Fair' :
                     'Strong'}
                  </span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <FaArrowRight />
                </>
              )}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-all">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  )
}