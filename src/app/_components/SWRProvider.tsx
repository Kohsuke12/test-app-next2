'use client'

import { SWRConfig } from 'swr'
import { swrConfig } from '@/lib/swr'

// フェッチャー関数
const fetcher = async (url: string) => {
  const res = await fetch(url)
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.text()
    throw error
  }
  
  return res.json()
}

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        ...swrConfig,
        fetcher,
        onError: (error) => {
          console.error('SWR Error:', error)
        },
      }}
    >
      {children}
    </SWRConfig>
  )
} 