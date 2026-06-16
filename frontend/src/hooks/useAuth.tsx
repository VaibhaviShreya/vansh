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
  sendOTP: (mobile: string) => Promise<{ success: boolean; message: string; session?: string }>
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

// Get API URL with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Configure axios defaults
axios.defaults.withCredentials = true
axios.defaults.timeout = 30000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Set up axios interceptor for token refresh or error handling
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    // Response interceptor for handling token expiration
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle CORS errors specifically
        if (error.code === 'ERR_NETWORK') {
          toast.error('Network error. Please check your connection.')
          return Promise.reject(error)
        }
        
        if (error.response?.status === 401) {
          // Token expired or invalid
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
    // Check if user is logged in
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

  const login = async (mobile: string, password: string) => {
    try {
      console.log(`📤 Login attempt for ${mobile}`)
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        mobile,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
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
      console.error('❌ Login error:', error)
      
      let errorMessage = 'Login failed'
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    try {
      console.log(`📤 Registration for ${data.mobile}`)
      
      // First verify OTP
      const verifyResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
        mobile: data.mobile,
        otp: data.otp,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
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
      console.error('❌ Registration error:', error)
      
      let errorMessage = 'Registration failed'
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      throw error
    }
  }

  const logout = async () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      delete axios.defaults.headers.common['Authorization']
      setUser(null)
      router.push('/')
    }
  }

  const sendOTP = async (mobile: string): Promise<{ success: boolean; message: string; session?: string }> => {
    try {
      console.log(`📤 Sending OTP to ${API_URL}/auth/send-otp for ${mobile}`)
      
      const response = await axios.post(`${API_URL}/auth/send-otp`, {
        mobile,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      
      console.log('✅ OTP Response:', response.data)
      
      if (response.data.success) {
        toast.success('OTP sent successfully!')
        return response.data
      } else {
        throw new Error(response.data.message || 'Failed to send OTP')
      }
    } catch (error: any) {
      console.error('❌ Send OTP error:', error)
      
      let errorMessage = 'Failed to send OTP'
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection and make sure the backend is running.'
      } else if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found. Please check the server URL.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      throw error
    }
  }

  const verifyOTP = async (mobile: string, otp: string): Promise<string> => {
    try {
      console.log(`📤 Verifying OTP for ${mobile}`)
      
      const response = await axios.post(`${API_URL}/auth/verify-otp`, {
        mobile,
        otp,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      
      if (!response.data.token) {
        throw new Error('Invalid OTP')
      }
      
      console.log('✅ OTP verified successfully')
      return response.data.token
    } catch (error: any) {
      console.error('❌ Verify OTP error:', error)
      
      let errorMessage = 'Invalid OTP'
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      throw error
    }
  }

  const setPassword = async (userId: string, password: string): Promise<{ token: string; user: User }> => {
    try {
      console.log(`📤 Setting password for user ${userId}`)
      
      const response = await axios.post(`${API_URL}/auth/set-password`, {
        userId,
        password,
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      })
      
      if (!response.data.token || !response.data.user) {
        throw new Error('Failed to set password')
      }
      
      console.log('✅ Password set successfully')
      return response.data
    } catch (error: any) {
      console.error('❌ Set password error:', error)
      
      let errorMessage = 'Failed to set password'
      if (error.code === 'ERR_NETWORK') {
        errorMessage = 'Network error. Please check your connection.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
      throw error
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