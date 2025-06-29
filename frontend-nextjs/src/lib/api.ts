// API Configuration - Automatically detects environment
const getApiBaseUrl = () => {
  // In production (deployed), use the environment variable
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In development, check if we're in browser to avoid SSR issues
  if (typeof window !== 'undefined') {
    // Try your deployed backend first, fallback to local
    return 'https://artelouarrate-production.up.railway.app/api';
  }
  
  // Default fallback
  return 'https://artelouarrate-production.up.railway.app/api';
};

const API_BASE_URL = getApiBaseUrl();

// Simple test function to check what endpoints exist
export const testBackendConnection = async () => {
  const baseUrl = 'https://artelouarrate-production.up.railway.app';
  const testUrls = [
    `${baseUrl}/`,
    `${baseUrl}/api`,
    `${baseUrl}/categories`,
    `${baseUrl}/api/categories`,
    `${baseUrl}/health`,
    `${baseUrl}/api/health`,
  ];

  const results = [];
  
  for (const url of testUrls) {
    try {
      const response = await fetch(url);
      results.push({
        url,
        status: response.status,
        ok: response.ok,
        data: response.ok ? await response.json() : null
      });
    } catch (error) {
      results.push({
        url,
        status: 'ERROR',
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  return results;
};

// Enhanced API client with proper error handling and retry logic
class ApiClient {
  private baseURL: string
  private defaultHeaders: HeadersInit

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const config: RequestInit = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error(`API request failed: ${url}`, error)
      throw error
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }
}

const apiClient = new ApiClient(API_BASE_URL)

// Types based on backend API structure
export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

export interface Category {
  id: string
  name: string
  description: string
  color: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  slug?: string
  imageUrl?: string
  updatedAt?: string
}

export interface ArtworkImage {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  url: string
  isPrimary: boolean
  artworkId: string
  createdAt: string
}

export interface Artwork {
  id: string
  name: string
  description: string
  price: number
  originalPrice: number
  medium?: string
  dimensions?: string
  year: number
  status: 'AVAILABLE' | 'SOLD' | 'RESERVED'
  isActive: boolean
  isFeatured: boolean
  viewCount: number
  categoryId?: string
  createdAt: string
  updatedAt: string
  images?: ArtworkImage[]
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  dateOfBirth?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminStats {
  totalUsers: number
  totalArtworks: number
  totalCategories: number
  totalViews: number
  recentRegistrations: number
  featuredArtworks: number
}

// API Functions organized by domain
export const authApi = {
  register: (userData: {
    email: string
    password: string
    firstName?: string
    lastName?: string
    phone?: string
    dateOfBirth?: string
  }) => apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register', userData),

  login: (credentials: { email: string; password: string }) =>
    apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/login', credentials),

  logout: () => apiClient.post<ApiResponse<null>>('/auth/logout'),

  getProfile: () => apiClient.get<ApiResponse<User>>('/auth/profile'),

  updateProfile: (userData: Partial<User>) =>
    apiClient.put<ApiResponse<User>>('/auth/profile', userData),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<null>>('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    apiClient.post<ApiResponse<null>>('/auth/reset-password', { token, password }),
}

export const artworksApi = {
  getAll: (params?: {
    category?: string
    search?: string
    sort?: string
    limit?: number
    offset?: number
  }) => {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.sort) queryParams.append('sort', params.sort)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    
    const queryString = queryParams.toString()
    return apiClient.get<ApiResponse<Artwork[]>>(`/artworks${queryString ? `?${queryString}` : ''}`)
  },

  getById: (id: string) => apiClient.get<ApiResponse<Artwork>>(`/artworks/${id}`),

  create: (artworkData: Omit<Artwork, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ApiResponse<Artwork>>('/artworks', artworkData),

  update: (id: string, artworkData: Partial<Artwork>) =>
    apiClient.put<ApiResponse<Artwork>>(`/artworks/${id}`, artworkData),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/artworks/${id}`),

  uploadImage: (artworkId: string, formData: FormData) =>
    apiClient.post<ApiResponse<ArtworkImage>>(`/artworks/${artworkId}/images`, formData, {
      headers: {}, // Let browser set Content-Type for multipart/form-data
    }),

  getFeatured: () => apiClient.get<ApiResponse<Artwork[]>>('/artworks/featured'),

  incrementView: (id: string) =>
    apiClient.post<ApiResponse<null>>(`/artworks/${id}/view`),
}

export const categoriesApi = {
  getAll: () => apiClient.get<ApiResponse<Category[]>>('/categories'),

  getById: (id: string) => apiClient.get<ApiResponse<Category>>(`/categories/${id}`),

  create: (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ApiResponse<Category>>('/categories', categoryData),

  update: (id: string, categoryData: Partial<Category>) =>
    apiClient.put<ApiResponse<Category>>(`/categories/${id}`, categoryData),

  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/categories/${id}`),
}

export const adminApi = {
  getStats: () => apiClient.get<ApiResponse<AdminStats>>('/admin/stats'),

  getUsers: (params?: { search?: string; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.search) queryParams.append('search', params.search)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    
    const queryString = queryParams.toString()
    return apiClient.get<ApiResponse<User[]>>(`/admin/users${queryString ? `?${queryString}` : ''}`)
  },

  updateUser: (id: string, userData: Partial<User>) =>
    apiClient.put<ApiResponse<User>>(`/admin/users/${id}`, userData),

  deleteUser: (id: string) => apiClient.delete<ApiResponse<null>>(`/admin/users/${id}`),

  getOrders: (params?: { status?: string; limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    
    const queryString = queryParams.toString()
    return apiClient.get<ApiResponse<any[]>>(`/admin/orders${queryString ? `?${queryString}` : ''}`)
  },

  getInquiries: (params?: { limit?: number; offset?: number }) => {
    const queryParams = new URLSearchParams()
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.offset) queryParams.append('offset', params.offset.toString())
    
    const queryString = queryParams.toString()
    return apiClient.get<ApiResponse<any[]>>(`/admin/inquiries${queryString ? `?${queryString}` : ''}`)
  },
}

export const contactApi = {
  submit: (contactData: {
    name: string
    email: string
    subject?: string
    message: string
    phone?: string
  }) => apiClient.post<ApiResponse<null>>('/contact', contactData),
}

// Export API client for custom requests
export { apiClient } 