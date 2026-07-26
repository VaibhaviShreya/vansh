'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { FaHistory, FaClock, FaUser, FaMobile } from 'react-icons/fa'

interface LoginHistory {
  timestamp: string
  ipAddress: string
  userAgent: string
  device: string
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([])
  const [loginCount, setLoginCount] = useState(0)
  const [lastLogin, setLastLogin] = useState<string>('')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
    
    if (user?.id) {
      // Fetch login history
      fetchLoginHistory(user.id)
    }
  }, [isAuthenticated, isLoading, user])

  const fetchLoginHistory = async (userId: string) => {
    try {
      const response = await fetch(`/api/auth/history/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setLoginHistory(data.data.loginHistory || [])
        setLoginCount(data.data.loginCount || 0)
        setLastLogin(data.data.lastLogin)
      }
    } catch (error) {
      console.error('Failed to fetch login history:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <FaUser className="text-3xl text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-4">{user?.name}</h2>
                <p className="text-gray-500 text-sm">{user?.mobile}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-xs font-semibold">
                  {user?.role}
                </span>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Total Logins</span>
                  <span className="font-semibold text-lg">{loginCount}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 text-sm">Last Login</span>
                  <span className="text-sm">
                    {lastLogin ? new Date(lastLogin).toLocaleString() : 'Never'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Login History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaHistory className="text-blue-600" />
                <h3 className="text-lg font-bold text-slate-900">Login History</h3>
                <span className="ml-auto text-sm text-gray-500">
                  Last 50 entries
                </span>
              </div>

              {loginHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FaClock className="text-4xl mx-auto mb-2" />
                  <p>No login history yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {loginHistory.map((entry, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaMobile className="text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            {entry.device || 'Unknown Device'}
                          </p>
                          <p className="text-xs text-gray-400">
                            IP: {entry.ipAddress || 'Unknown'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Unknown'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}