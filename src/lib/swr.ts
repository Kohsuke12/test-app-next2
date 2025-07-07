//useSWRWithAuthを使うために、このファイルを作成

import useSWR, { SWRConfiguration } from 'swr'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'

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

// 認証付きフェッチャー関数
export const authFetcher = async (url: string, token: string) => {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: token }),
    },
  })
  
  if (!res.ok) {
    const error = new Error('An error occurred while fetching the data.')
    error.message = await res.text()
    throw error
  }
  
  return res.json()
}

// デフォルト設定（関数を除く）
export const swrConfig: Omit<SWRConfiguration, 'fetcher' | 'onError'> = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  errorRetryCount: 3,
  errorRetryInterval: 5000,
}

// カスタムフック（トークンを内部で取得）
export const useSWRWithAuth = (url: string | null) => {
  const { token } = useSupabaseSession()
  
  return useSWR(
    url && token ? [url, token] : null,
    ([url, token]) => authFetcher(url, token),
    {
      ...swrConfig,
      onError: (error) => {
        console.error('SWR Error:', error)
      },
    }
  )
}

export default useSWR 