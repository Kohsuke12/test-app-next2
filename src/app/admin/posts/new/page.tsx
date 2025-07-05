'use client'

import { useRouter } from 'next/navigation'
import { PostForm } from '../_components/PostForm'
import { Category } from '@/types/Category'
import { useSupabaseSession } from '@/app/_hooks/useSupabaseSession'
import { CreatePostRequestBody } from '@/types/api'

export default function Page() {
  const router = useRouter()
  const { token } = useSupabaseSession()

  const handleSubmit = async (data: { title: string; content: string; thumbnailImageKey: string; categories: Category[] }) => {
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

    // レスポンスから作成した記事のIDを取得します。
    const { id } = await res.json()

    // 作成した記事の詳細ページに遷移します。
    router.push(`/admin/posts/${id}`)

    alert('記事を作成しました。')
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
