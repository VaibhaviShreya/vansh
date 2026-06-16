'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../../hooks/useAuth'
import { Toaster } from 'react-hot-toast'
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '8px',
              padding: '12px 16px',
            },
            success: {
              style: {
                background: '#22C55E',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#22C55E',
              },
            },
            error: {
              style: {
                background: '#EF4444',
              },
              iconTheme: {
                primary: '#fff',
                secondary: '#EF4444',
              },
            },
            loading: {
              style: {
                background: '#3B82F6',
              },
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}