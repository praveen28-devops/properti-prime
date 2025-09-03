import { Property } from "@/components/PropertyCard";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface CreatePropertyRequest {
  title: string;
  price: number;
  location: string;
  type?: 'apartment' | 'house' | 'condo' | 'townhouse';
  beds?: number;
  baths?: number;
  imageUrl?: string;
  priceType?: 'rent' | 'sale';
  squareFeet?: number;
  description?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface ApiError {
  error: string;
  message?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  // GET /properties - Fetch all properties
  async getProperties(): Promise<Property[]> {
    const response = await this.request<ApiResponse<Property[]>>('/properties');
    return response.data;
  }

  // GET /properties/:id - Fetch single property
  async getProperty(id: string): Promise<Property> {
    const response = await this.request<ApiResponse<Property>>(`/properties/${id}`);
    return response.data;
  }

  // POST /properties - Create new property
  async createProperty(propertyData: CreatePropertyRequest): Promise<Property> {
    const response = await this.request<ApiResponse<Property>>('/properties', {
      method: 'POST',
      body: JSON.stringify(propertyData),
    });
    return response.data;
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
