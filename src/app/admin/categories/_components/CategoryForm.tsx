import React from 'react'
import { useForm } from 'react-hook-form'

interface CategoryFormData {
  name: string
}

interface Props {
  mode: 'new' | 'edit'
  defaultValues?: CategoryFormData
  onSubmit: (data: CategoryFormData) => void
  onDelete?: () => void
}

export const CategoryForm: React.FC<Props> = ({
  mode,
  defaultValues,
  onSubmit,
  onDelete,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    defaultValues,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          カテゴリー名
        </label>
        <input
          type="text"
          id="name"
          className="mt-1 block w-full rounded-md border border-gray-200 p-3"
          {...register('name', { required: 'カテゴリー名は必須です' })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
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
