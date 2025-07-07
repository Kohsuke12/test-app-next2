import useSWR from 'swr'
import { Post } from '@/types/post'

export const usePosts = () => {
  const { data, error, isLoading, mutate } = useSWR<{ posts: Post[] }>('/api/posts', {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 5000, // 5秒ごとに更新
  })

  return {
    posts: data?.posts || [],
    error,
    isLoading,
    mutate,
  }
} 