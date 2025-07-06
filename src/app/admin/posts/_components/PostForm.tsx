//react-hook-form導入確認用

import { Category } from '@/types/Category'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { CategoriesSelect } from './CategoriesSelect'
import { v4 as uuidv4 } from 'uuid' // 固有のIDを生成するライブラリです。`npm install uuid @types/uuid` でインストールしてください。
import { supabase } from '@/utils/supabase'
import Image from 'next/image'
import { useForm, Controller } from 'react-hook-form'

interface PostFormData {
  title: string
  content: string
  thumbnailImageKey: string
  categories: Category[]
}

interface Props {
  mode: 'new' | 'edit'
  defaultValues?: PostFormData
  onSubmit: (data: PostFormData) => void
  onDelete?: () => void
}

export const PostForm: React.FC<Props> = ({
  mode,
  defaultValues,
  onSubmit,
  onDelete,
}) => {
  const [thumbnailImageUrl, setThumbnailImageUrl] = useState<null | string>(
    null,
  )

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PostFormData>({
    defaultValues,
  })

  const thumbnailImageKey = watch('thumbnailImageKey')

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (!event.target.files || event.target.files.length == 0) {
      // 画像が選択されていないのでreturn
      return
    }

    // eventから画像を取得
    const file = event.target.files[0] // 選択された画像を取得

    // private/は必ずつけること
    const filePath = `private/${uuidv4()}` // ファイル名を指定

    // Supabase Storageに画像をアップロード
    const { data, error } = await supabase.storage
      .from('post-thumbnail')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    // アップロードに失敗したらエラーを表示
    if (error) {
      alert(error.message)
      return
    }

    // data.pathに画像のパスが格納されているので、thumbnailImageKeyに格納
    setValue('thumbnailImageKey', data.path)
  }

  // DBに保存しているthumbnailImageKeyを元に、Supabaseから画像のURLを取得する
  useEffect(() => {
    if (!thumbnailImageKey) return

    const fetcher = async () => {
      const {
        data: { publicUrl },
      } = await supabase.storage
        .from('post-thumbnail')
        .getPublicUrl(thumbnailImageKey)

      setThumbnailImageUrl(publicUrl)
    }

    fetcher()
  }, [thumbnailImageKey])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          タイトル
        </label>
        <input
          type="text"
          id="title"
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          {...register('title', { required: 'タイトルは必須です' })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          内容
        </label>
        <textarea
          id="content"
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          {...register('content', { required: '内容は必須です' })}
        />
        {errors.content && (
          <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="thumbnailImageKey"
          className="block text-sm font-medium text-gray-700"
        >
          サムネイルURL
        </label>
        <input
          type="file"
          id="thumbnailImageKey"
          onChange={handleImageChange}
        />
        {thumbnailImageUrl && (
          <div className="mt-2">
            <Image
              src={thumbnailImageUrl}
              alt="thumbnail"
              width={400}
              height={400}
            />
          </div>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          カテゴリー
        </label>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <CategoriesSelect
              selectedCategories={field.value || []}
              setSelectedCategories={field.onChange}
            />
          )}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? '処理中...' : mode === 'new' ? '作成' : '更新'}
      </button>
      {mode === 'edit' && (
        <button
          type="button"
          className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
          onClick={onDelete}
        >
          削除
        </button>
      )}
    </form>
  )
}
