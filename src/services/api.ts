import { Property } from "@/components/PropertyCard";
import { Room } from "@/components/RoomCard";
import { RatePlan } from "@/components/RatePlan";
import { Reservation } from "@/components/BookingEngine";

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

export interface CreateRoomRequest {
  propertyId: string;
  roomNumber: string;
  roomType: "single" | "double" | "suite" | "deluxe" | "presidential";
  capacity: number;
  baseRate: number;
  amenities?: string[];
  floor: number;
  size: number;
  description?: string;
  images?: string[];
}

export interface CreateRatePlanRequest {
  propertyId: string;
  roomId?: string;
  name: string;
  description?: string;
  baseRate: number;
  currency: string;
  rateType: "nightly" | "weekly" | "monthly";
  seasonType: "standard" | "peak" | "off-peak" | "holiday";
  validFrom: string;
  validTo: string;
  minimumStay: number;
  maximumStay?: number;
  advanceBookingDays: number;
  cancellationPolicy: "flexible" | "moderate" | "strict";
  isActive: boolean;
  restrictions?: {
    weekendSurcharge?: number;
    minimumOccupancy?: number;
    maximumOccupancy?: number;
    blackoutDates?: string[];
  };
  discounts?: {
    earlyBird?: number;
    lastMinute?: number;
    extendedStay?: number;
  };
}

export interface CreateReservationRequest {
  propertyId: string;
  roomId: string;
  ratePlanId?: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalAmount: number;
  currency: string;
  specialRequests?: string;
  paymentMethod: string;
  paymentDetails?: any;
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

  // PUT /properties/:id - Update property
  async updateProperty(id: string, propertyData: Partial<CreatePropertyRequest>): Promise<Property> {
    const response = await this.request<ApiResponse<Property>>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(propertyData),
    });
    return response.data;
  }

  // DELETE /properties/:id - Delete property
  async deleteProperty(id: string): Promise<void> {
    await this.request<ApiResponse<void>>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Room Management APIs
  
  // GET /properties/:propertyId/rooms - Fetch rooms for a property
  async getRooms(propertyId: string): Promise<Room[]> {
    const response = await this.request<ApiResponse<Room[]>>(`/properties/${propertyId}/rooms`);
    return response.data;
  }

  // GET /rooms/:id - Fetch single room
  async getRoom(id: string): Promise<Room> {
    const response = await this.request<ApiResponse<Room>>(`/rooms/${id}`);
    return response.data;
  }

  // POST /rooms - Create new room
  async createRoom(roomData: CreateRoomRequest): Promise<Room> {
    const response = await this.request<ApiResponse<Room>>('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
    return response.data;
  }

  // PUT /rooms/:id - Update room
  async updateRoom(id: string, roomData: Partial<CreateRoomRequest>): Promise<Room> {
    const response = await this.request<ApiResponse<Room>>(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
    return response.data;
  }

  // DELETE /rooms/:id - Delete room
  async deleteRoom(id: string): Promise<void> {
    await this.request<ApiResponse<void>>(`/rooms/${id}`, {
      method: 'DELETE',
    });
  }

  // Rate Plan Management APIs
  
  // GET /properties/:propertyId/rate-plans - Fetch rate plans for a property
  async getRatePlans(propertyId: string): Promise<RatePlan[]> {
    const response = await this.request<ApiResponse<RatePlan[]>>(`/properties/${propertyId}/rate-plans`);
    return response.data;
  }

  // GET /rate-plans/:id - Fetch single rate plan
  async getRatePlan(id: string): Promise<RatePlan> {
    const response = await this.request<ApiResponse<RatePlan>>(`/rate-plans/${id}`);
    return response.data;
  }

  // POST /rate-plans - Create new rate plan
  async createRatePlan(ratePlanData: CreateRatePlanRequest): Promise<RatePlan> {
    const response = await this.request<ApiResponse<RatePlan>>('/rate-plans', {
      method: 'POST',
      body: JSON.stringify(ratePlanData),
    });
    return response.data;
  }

  // PUT /rate-plans/:id - Update rate plan
  async updateRatePlan(id: string, ratePlanData: Partial<CreateRatePlanRequest>): Promise<RatePlan> {
    const response = await this.request<ApiResponse<RatePlan>>(`/rate-plans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ratePlanData),
    });
    return response.data;
  }

  // DELETE /rate-plans/:id - Delete rate plan
  async deleteRatePlan(id: string): Promise<void> {
    await this.request<ApiResponse<void>>(`/rate-plans/${id}`, {
      method: 'DELETE',
    });
  }

  // Reservation Management APIs
  
  // GET /properties/:propertyId/reservations - Fetch reservations for a property
  async getReservations(propertyId: string): Promise<Reservation[]> {
    const response = await this.request<ApiResponse<Reservation[]>>(`/properties/${propertyId}/reservations`);
    return response.data;
  }

  // GET /reservations/:id - Fetch single reservation
  async getReservation(id: string): Promise<Reservation> {
    const response = await this.request<ApiResponse<Reservation>>(`/reservations/${id}`);
    return response.data;
  }

  // POST /reservations - Create new reservation
  async createReservation(reservationData: CreateReservationRequest): Promise<Reservation> {
    const response = await this.request<ApiResponse<Reservation>>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservationData),
    });
    return response.data;
  }

  // PUT /reservations/:id - Update reservation
  async updateReservation(id: string, reservationData: Partial<CreateReservationRequest>): Promise<Reservation> {
    const response = await this.request<ApiResponse<Reservation>>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservationData),
    });
    return response.data;
  }

  // DELETE /reservations/:id - Cancel reservation
  async cancelReservation(id: string): Promise<void> {
    await this.request<ApiResponse<void>>(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
