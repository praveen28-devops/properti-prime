// Hotel Management System Types

export interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  roomType: 'single' | 'double' | 'suite' | 'deluxe' | 'presidential';
  capacity: number;
  baseRate: number;
  amenities: string[];
  isAvailable: boolean;
  floor: number;
  size: number; // in sq ft
  description: string;
  images: string[];
}

export interface RatePlan {
  id: string;
  propertyId: string;
  name: string;
  roomTypeId: string;
  baseRate: number;
  seasonalRates: SeasonalRate[];
  restrictions: StayRestrictions;
  isActive: boolean;
  validFrom: string;
  validTo: string;
}

export interface SeasonalRate {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  rate: number;
  multiplier: number;
}

export interface StayRestrictions {
  minimumStay: number;
  maximumStay: number;
  closedDays: string[];
  advanceBooking: number;
  cancellationPolicy: string;
}

export interface Reservation {
  id: string;
  propertyId: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalAmount: number;
  status: 'confirmed' | 'pending' | 'cancelled' | 'checked-in' | 'checked-out';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  source: 'direct' | 'booking.com' | 'expedia' | 'agoda' | 'phone' | 'walk-in';
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: string;
  propertyId: string;
  roomId: string;
  date: string;
  isAvailable: boolean;
  rate: number;
  minimumStay: number;
  closedToArrival: boolean;
  closedToDeparture: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: 'single' | 'chain' | 'group';
  properties: string[];
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  currency: string;
  timezone: string;
  dateFormat: string;
  defaultCheckIn: string;
  defaultCheckOut: string;
  cancellationPolicy: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'viewer';
  organizationId: string;
  propertyAccess: string[];
  permissions: Permission[];
  isActive: boolean;
}

export interface Permission {
  resource: string;
  actions: ('create' | 'read' | 'update' | 'delete')[];
}

export interface Report {
  id: string;
  type: 'occupancy' | 'revenue' | 'adr' | 'revpar' | 'booking-source';
  propertyId: string;
  dateRange: {
    start: string;
    end: string;
  };
  data: any;
  generatedAt: string;
}

export interface Channel {
  id: string;
  name: string;
  type: 'ota' | 'gds' | 'metasearch' | 'direct';
  isActive: boolean;
  commission: number;
  settings: ChannelSettings;
}

export interface ChannelSettings {
  apiKey?: string;
  hotelId?: string;
  ratePlanMapping: { [key: string]: string };
  inventorySync: boolean;
  rateSync: boolean;
}
