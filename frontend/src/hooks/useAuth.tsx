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
  verifyOTP: (mobile: string, otp: string) => Promise<string>
  setPassword: (userId: string, password: string) => Promise<{ token: string; user: User }>
}

interface RegisterData {
  name: string
  mobile: string
  password: string
  otp: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Use environment variable with fallback
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
      console.log(`📤 Sending OTP to ${API_URL}/auth/send-otp`)
      const response = await axios.post(`${API_URL}/auth/send-otp`, {
        mobile,
      })
      console.log('✅ OTP Response:', response.data)
      toast.success('OTP sent successfully!')
      return response.data
    } catch (error: any) {
      console.error('❌ Send OTP error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send OTP'
      toast.error(errorMessage)
      throw error
    }
  }

  // Verify OTP
  const verifyOTP = async (mobile: string, otp: string) => {
    try {
      console.log(`📤 Verifying OTP for ${mobile}`)
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        mobile,
        otp,
      })
      console.log('✅ Verify OTP Response:', response.data)
      
      if (!response.data.token) {
        throw new Error('Invalid OTP')
      }
      
      return response.data.token
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error)
      const errorMessage = error.response?.data?.message || 'Invalid OTP'
      toast.error(errorMessage)
      throw error
    }
  }

  // Set password
  const setPassword = async (userId: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/set-password`, {
        userId,
        password,
      })
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Failed to set password')
      }
      
      return response.data
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to set password'
      toast.error(errorMessage)
      throw error
    }
  }

  // Login
  const login = async (mobile: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        mobile,
        password,
      })

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
      const errorMessage = error.response?.data?.message || error.message || 'Login failed'
      toast.error(errorMessage)
      throw error
    }
  }

  // Register
  const register = async (data: RegisterData) => {
    try {
      // First verify OTP
      const verifyResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
        mobile: data.mobile,
        otp: data.otp,
      })

      if (!verifyResponse.data.user?.id) {
        throw new Error('OTP verification failed')
      }

      // Set password
      const { token, user: userData } = await setPassword(
        verifyResponse.data.user.id, 
        data.password
      )

      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(userData))
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(userData)
      toast.success('Registration successful!')
      router.push('/dashboard')
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed'
      toast.error(errorMessage)
      throw error
    }
  }

  // Logout
  const logout = async () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
      router.push('/')
    }
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