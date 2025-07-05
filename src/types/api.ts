// API Request/Response Types

// Posts API
export interface CreatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey: string
}

export interface UpdatePostRequestBody {
  title: string
  content: string
  categories: { id: number }[]
  thumbnailImageKey: string
}

// Categories API
export interface CreateCategoryRequestBody {
  name: string
}

export interface UpdateCategoryRequestBody {
  name: string
}

// Common API Response
export interface ApiResponse<T = any> {
  status: string
  message?: string
  data?: T
}

export interface PostsResponse extends ApiResponse {
  posts?: any[]
}

export interface PostResponse extends ApiResponse {
  post?: any
  id?: number
}

export interface CategoriesResponse extends ApiResponse {
  categories?: any[]
}

export interface CategoryResponse extends ApiResponse {
  category?: any
  id?: number
} 