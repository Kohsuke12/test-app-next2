import { useSWRWithAuth } from '@/lib/swr'
import { Post } from '@/types/post'

export const useAdminPosts = () => {
  const { data, error, isLoading, mutate } = useSWRWithAuth<{ posts: Post[] }>('/api/admin/posts')

  return {
    posts: data?.posts || [],
    error,
    isLoading,
    mutate,
  }
} 