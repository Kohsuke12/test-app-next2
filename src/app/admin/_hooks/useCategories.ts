import { useSWRWithAuth } from '@/lib/swr'
import { Category } from '@/types/Category'

export const useCategories = () => {
  const { data, error, isLoading, mutate } = useSWRWithAuth<{ categories: Category[] }>('/api/admin/categories')

  return {
    categories: data?.categories || [],
    error,
    isLoading,
    mutate,
  }
} 