'use client'

import { useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Category } from '@/types/Category'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { CreatePostRequestBody } from '@/types/api'
import { useAdminPosts } from '@/hooks/useAdminPosts'
import { usePosts } from '@/hooks/usePosts'

export default function Page() {
  const router = useRouter()
  const { token } = useSupabaseSession()
  const { mutate: mutateAdminPosts } = useAdminPosts()
  const { mutate: mutatePosts } = usePosts()

  const handleSubmit = async (data: { title: string; content: string; thumbnailImageKey: string; categories: Category[] }) => {
    try {
      // 記事を作成します。
      const res = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token!,
        },
        body: JSON.stringify({ 
          title: data.title, 
          content: data.content, 
          thumbnailImageKey: data.thumbnailImageKey, 
          categories: data.categories 
        } as CreatePostRequestBody),
      })

      if (!res.ok) {
        throw new Error('記事の作成に失敗しました')
      }

      // レスポンスから作成した記事のIDを取得します。
      const { id } = await res.json()

      // SWRのキャッシュを更新
      mutateAdminPosts()
      mutatePosts()

      alert('記事を作成しました。')

      // 記事一覧ページに戻ります。
      router.push('/admin/posts')
    } catch (error) {
      console.error('記事作成エラー:', error)
      alert('記事の作成に失敗しました。')
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">記事作成</h1>
      </div>

      <PostForm
        mode="new"
        onSubmit={handleSubmit}
      />
    </div>
  )
}
