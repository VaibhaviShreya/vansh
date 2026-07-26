'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

interface User {
  id: string
  name: string
  mobile: string
  role: 'user' | 'admin'
  isVerified: boolean
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (mobile: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  sendOTP: (mobile: string) => Promise<any>
  verifyOTP: (mobile: string, otp: string, name?: string) => Promise<{ token: string; userId: string }>
  setPassword: (userId: string, password: string, name?: string) => Promise<{ token: string; user: User }>
  resendOTP: (mobile: string) => Promise<any>
}

interface RegisterData {
  userId: string
  password: string
  verificationToken: string
  name?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          delete axios.defaults.headers.common['Authorization']
          setUser(null)
          toast.error('Session expired. Please login again.')
          router.push('/login')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (error) {
        console.error('Failed to parse user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
      }
    }
    setIsLoading(false)
  }, [])

  // Send OTP
  const sendOTP = async (mobile: string) => {
    try {
      console.log(`📤 Sending OTP to: ${API_URL}/auth/send-otp`)
      const response = await axios.post(`${API_URL}/auth/send-otp`, { mobile })
      console.log('✅ OTP Response:', response.data)
      
      if (response.data.success) {
        toast.success('OTP sent successfully!')
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to send OTP')
      }
    } catch (error: any) {
      console.error('❌ Send OTP error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to send OTP'
      toast.error(errorMessage)
      throw error
    }
  }

  // Verify OTP
  const verifyOTP = async (mobile: string, otp: string, name?: string) => {
    try {
      console.log(`📤 Verifying OTP for ${mobile}: ${otp}`)
      
      const response = await axios.post(
        `${API_URL}/auth/verify-otp`,
        {
          mobile,
          otp,
          name: name || 'User'
        }
      )
      
      console.log('✅ Verify OTP Response:', response.data)
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Invalid OTP')
      }
      
      return {
        token: response.data.token,
        userId: response.data.data?.userId
      }
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error)
      console.error('Error response:', error.response?.data)
      
      let errorMessage = 'Invalid OTP'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      toast.error(errorMessage)
      throw error
    }
  }

  // Resend OTP - FIXED
  const resendOTP = async (mobile: string) => {
    try {
      console.log(`📤 Resending OTP to: ${API_URL}/auth/resend-otp`)
      const response = await axios.post(`${API_URL}/auth/resend-otp`, { mobile })
      console.log('✅ Resend OTP Response:', response.data)
      
      if (response.data.success) {
        toast.success('OTP resent successfully!')
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to resend OTP')
      }
    } catch (error: any) {
      console.error('❌ Resend OTP error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to resend OTP'
      toast.error(errorMessage)
      throw error
    }
  }

  // Set Password (Complete Registration)
  const setPassword = async (userId: string, password: string, name?: string) => {
    try {
      console.log(`📤 Setting password for user: ${userId}`)
      
      const response = await axios.post(
        `${API_URL}/auth/set-password`,
        {
          userId,
          password,
          name
        }
      )
      
      console.log('✅ Set Password Response:', response.data)
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to set password')
      }
      
      return response.data
    } catch (error: any) {
      console.error('❌ Set password error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to set password'
      toast.error(errorMessage)
      throw error
    }
  }

  // Register - FIXED
  const register = async (data: RegisterData) => {
    try {
      console.log(`📤 Registering user: ${data.userId}`)
      
      const response = await axios.post(
        `${API_URL}/auth/set-password`,
        {
          userId: data.userId,
          password: data.password,
          name: data.name || ''
        },
        {
          headers: {
            Authorization: `Bearer ${data.verificationToken}`
          }
        }
      )
      
      console.log('✅ Registration Response:', response.data)
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Registration failed')
      }
      
      // Save token and user data
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      setUser(response.data.user)
      
      toast.success('Registration successful!')
      router.push('/dashboard')
      
      return response.data
    } catch (error: any) {
      console.error('❌ Registration error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(errorMessage)
      throw error
    }
  }

  // Login
  const login = async (mobile: string, password: string) => {
    try {
      console.log(`📤 Logging in: ${mobile}`)
      
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          mobile,
          password
        }
      )
      
      console.log('✅ Login Response:', response.data)
      
      const { token, user: userData } = response.data
      
      if (token && userData) {
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(userData))
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
        toast.success('Login successful!')
        router.push('/dashboard')
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error: any) {
      console.error('❌ Login error:', error)
      const errorMessage = error.response?.data?.message || 'Login failed'
      toast.error(errorMessage)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    toast.success('Logged out successfully')
    router.push('/')
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    sendOTP,
    verifyOTP,
    setPassword,
    resendOTP, // ✅ Added resendOTP here
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}