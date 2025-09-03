import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002 ;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// In-memory storage (replace with actual database in production)
let properties = [
  {
    id: "1",
    title: "Mumbai Downtown Apartment",
    address: "123 Main Street, Downtown, Mumbai 400001",
    price: 2500,
    priceType: "rent",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: "Beautiful modern apartment in the heart of downtown. Features floor-to-ceiling windows, stainless steel appliances, and a private balcony with city views. Walking distance to restaurants, shopping, and public transportation.",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    contactPhone: "(555) 123-4567",
    contactEmail: "agent@modernproperties.com"
  },
  {
    id: "2",
    title: "Luxury Family Home",
    address: "456 Oak Avenue, Suburbia, Pune 411001",
    price: 850000,
    priceType: "sale",
    propertyType: "house",
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 2800,
    description: "Stunning single-family home with spacious rooms and premium finishes. Features a gourmet kitchen, master suite with walk-in closet, finished basement, and beautifully landscaped backyard. Perfect for families.",
    imageUrl: "https://images.unsplash.com/photo-1558036117-15d82a90b9b1?w=800&h=600&fit=crop",
    contactPhone: "(555) 987-6543",
    contactEmail: "luxury@realestate.com"
  },
];

// Extended data storage for hotel management
let rooms = [];
let reservations = [];
let ratePlans = [];
let availability = [];
let users = [{
  id: "1",
  name: "Admin User",
  email: "admin@propertiprime.com",
  role: "admin",
  organizationId: "1",
  propertyAccess: ["1", "2"],
  permissions: [{ resource: "*", actions: ["create", "read", "update", "delete"] }],
  isActive: true
}];
let organizations = [{
  id: "1",
  name: "PropertyPrime Hotels",
  type: "chain",
  properties: ["1", "2"],
  settings: {
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    defaultCheckIn: "14:00",
    defaultCheckOut: "11:00",
    cancellationPolicy: "Free cancellation up to 24 hours before check-in"
  }
}];

// Property validation schema
const PropertySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  price: z.number().positive("Price must be positive"),
  location: z.string().min(1, "Location is required").max(300, "Location too long"),
  type: z.enum(["hotel", "resort", "apartment", "house", "condo", "townhouse"]).optional().default("hotel"),
  beds: z.number().int().min(0).optional().default(1),
  baths: z.number().min(0).optional().default(1),
  imageUrl: z.string().url().optional(),
  priceType: z.enum(["rent", "sale", "nightly"]).optional().default("nightly"),
  squareFeet: z.number().int().min(1).optional().default(1000),
  description: z.string().optional().default(""),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
  // Hotel-specific fields
  starRating: z.number().min(1).max(5).optional().default(3),
  amenities: z.array(z.string()).optional().default([]),
  checkInTime: z.string().optional().default("14:00"),
  checkOutTime: z.string().optional().default("11:00"),
  organizationId: z.string().optional().default("1")
});

// Room validation schema
const RoomSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  roomNumber: z.string().min(1, "Room number is required"),
  roomType: z.enum(["single", "double", "suite", "deluxe", "presidential"]),
  capacity: z.number().int().min(1).max(10),
  baseRate: z.number().positive("Base rate must be positive"),
  amenities: z.array(z.string()).optional().default([]),
  floor: z.number().int().min(0),
  size: z.number().positive("Size must be positive"),
  description: z.string().optional().default(""),
  images: z.array(z.string().url()).optional().default([])
});

// Reservation validation schema
const ReservationSchema = z.object({
  propertyId: z.string().min(1, "Property ID is required"),
  roomId: z.string().min(1, "Room ID is required"),
  guestName: z.string().min(1, "Guest name is required"),
  guestEmail: z.string().email("Valid email is required"),
  guestPhone: z.string().min(10, "Valid phone number is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
  adults: z.number().int().min(1).max(10),
  children: z.number().int().min(0).max(10),
  totalAmount: z.number().positive("Total amount must be positive"),
  currency: z.string().min(1, "Currency is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  specialRequests: z.string().optional().default("")
});

// Error handling middleware
const handleValidationError = (error, req, res, next) => {
  if (error instanceof z.ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }))
    });
  }
  next(error);
};

// Routes

// Reservation Management Endpoints

// GET /properties/:propertyId/reservations - Get all reservations for a property
app.get('/properties/:propertyId/reservations', (req, res) => {
  try {
    const { propertyId } = req.params;
    const propertyReservations = reservations.filter(r => r.propertyId === propertyId);
    
    res.json({
      success: true,
      data: propertyReservations,
      count: propertyReservations.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservations', message: error.message });
  }
});

// GET /reservations/:id - Get single reservation
app.get('/reservations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const reservation = reservations.find(r => r.id === id);
    
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.json({
      success: true,
      data: reservation
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reservation', message: error.message });
  }
});

// POST /reservations - Create new reservation
app.post('/reservations', (req, res) => {
  try {
    const validatedData = ReservationSchema.parse(req.body);
    
    const newReservation = {
      id: uuidv4(),
      ...validatedData,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    reservations.push(newReservation);
    
    res.status(201).json({
      success: true,
      data: newReservation,
      message: 'Reservation created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create reservation', message: error.message });
  }
});

// PUT /reservations/:id - Update reservation
app.put('/reservations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const reservationIndex = reservations.findIndex(r => r.id === id);
    
    if (reservationIndex === -1) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    const validatedData = ReservationSchema.partial().parse(req.body);
    
    reservations[reservationIndex] = {
      ...reservations[reservationIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: reservations[reservationIndex],
      message: 'Reservation updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update reservation', message: error.message });
  }
});

// DELETE /reservations/:id - Cancel reservation
app.delete('/reservations/:id', (req, res) => {
  try {
    const { id } = req.params;
    const reservationIndex = reservations.findIndex(r => r.id === id);
    
    if (reservationIndex === -1) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    reservations.splice(reservationIndex, 1);
    
    res.json({
      success: true,
      message: 'Reservation cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to cancel reservation', message: error.message });
  }
});

// Rate Plan Management Endpoints

// GET /properties/:propertyId/rate-plans - Get all rate plans for a property
app.get('/properties/:propertyId/rate-plans', (req, res) => {
  try {
    const { propertyId } = req.params;
    const propertyRatePlans = ratePlans.filter(rp => rp.propertyId === propertyId);
    
    res.json({
      success: true,
      data: propertyRatePlans,
      count: propertyRatePlans.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rate plans', message: error.message });
  }
});

// GET /rate-plans/:id - Get single rate plan
app.get('/rate-plans/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ratePlan = ratePlans.find(rp => rp.id === id);
    
    if (!ratePlan) {
      return res.status(404).json({ error: 'Rate plan not found' });
    }
    
    res.json({
      success: true,
      data: ratePlan
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rate plan', message: error.message });
  }
});

// POST /rate-plans - Create new rate plan
app.post('/rate-plans', (req, res) => {
  try {
    const validatedData = RatePlanSchema.parse(req.body);
    
    const newRatePlan = {
      id: uuidv4(),
      ...validatedData,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    ratePlans.push(newRatePlan);
    
    res.status(201).json({
      success: true,
      data: newRatePlan,
      message: 'Rate plan created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create rate plan', message: error.message });
  }
});

// PUT /rate-plans/:id - Update rate plan
app.put('/rate-plans/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ratePlanIndex = ratePlans.findIndex(rp => rp.id === id);
    
    if (ratePlanIndex === -1) {
      return res.status(404).json({ error: 'Rate plan not found' });
    }
    
    const validatedData = RatePlanSchema.partial().parse(req.body);
    
    ratePlans[ratePlanIndex] = {
      ...ratePlans[ratePlanIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: ratePlans[ratePlanIndex],
      message: 'Rate plan updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update rate plan', message: error.message });
  }
});

// PUT /rate-plans/:id/toggle-status - Toggle rate plan active status
app.put('/rate-plans/:id/toggle-status', (req, res) => {
  try {
    const { id } = req.params;
    const ratePlanIndex = ratePlans.findIndex(rp => rp.id === id);
    
    if (ratePlanIndex === -1) {
      return res.status(404).json({ error: 'Rate plan not found' });
    }
    
    ratePlans[ratePlanIndex].isActive = !ratePlans[ratePlanIndex].isActive;
    ratePlans[ratePlanIndex].updatedAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: ratePlans[ratePlanIndex],
      message: `Rate plan ${ratePlans[ratePlanIndex].isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle rate plan status', message: error.message });
  }
});

// DELETE /rate-plans/:id - Delete rate plan
app.delete('/rate-plans/:id', (req, res) => {
  try {
    const { id } = req.params;
    const ratePlanIndex = ratePlans.findIndex(rp => rp.id === id);
    
    if (ratePlanIndex === -1) {
      return res.status(404).json({ error: 'Rate plan not found' });
    }
    
    ratePlans.splice(ratePlanIndex, 1);
    
    res.json({
      success: true,
      message: 'Rate plan deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rate plan', message: error.message });
  }
});

// Room Management Endpoints

// GET /properties/:propertyId/rooms - Get all rooms for a property
app.get('/properties/:propertyId/rooms', (req, res) => {
  try {
    const { propertyId } = req.params;
    const propertyRooms = rooms.filter(r => r.propertyId === propertyId);
    
    res.json({
      success: true,
      data: propertyRooms,
      count: propertyRooms.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rooms', message: error.message });
  }
});

// GET /rooms/:id - Get single room
app.get('/rooms/:id', (req, res) => {
  try {
    const { id } = req.params;
    const room = rooms.find(r => r.id === id);
    
    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch room', message: error.message });
  }
});

// POST /rooms - Create new room
app.post('/rooms', (req, res) => {
  try {
    const validatedData = RoomSchema.parse(req.body);
    
    const newRoom = {
      id: uuidv4(),
      ...validatedData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    rooms.push(newRoom);
    
    res.status(201).json({
      success: true,
      data: newRoom,
      message: 'Room created successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to create room', message: error.message });
  }
});

// PUT /rooms/:id - Update room
app.put('/rooms/:id', (req, res) => {
  try {
    const { id } = req.params;
    const roomIndex = rooms.findIndex(r => r.id === id);
    
    if (roomIndex === -1) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    const validatedData = RoomSchema.partial().parse(req.body);
    
    rooms[roomIndex] = {
      ...rooms[roomIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: rooms[roomIndex],
      message: 'Room updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: error.errors
      });
    }
    res.status(500).json({ error: 'Failed to update room', message: error.message });
  }
});

// DELETE /rooms/:id - Delete room
app.delete('/rooms/:id', (req, res) => {
  try {
    const { id } = req.params;
    const roomIndex = rooms.findIndex(r => r.id === id);
    
    if (roomIndex === -1) {
      return res.status(404).json({ error: 'Room not found' });
    }
    
    rooms.splice(roomIndex, 1);
    
    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete room', message: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Get all properties
app.get('/properties', (req, res) => {
  res.json({
    success: true,
    data: properties,
    count: properties.length
  });
});

// Get property by ID
app.get('/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === req.params.id);
  if (!property) {
    return res.status(404).json({
      error: "Property not found"
    });
  }
  
  // Include rooms for this property
  const propertyRooms = rooms.filter(r => r.propertyId === req.params.id);
  
  res.json({
    success: true,
    data: {
      ...property,
      rooms: propertyRooms
    }
  });
});

// PUT /properties/:id - Update property
app.put('/properties/:id', async (req, res) => {
  try {
    const propertyIndex = properties.findIndex(p => p.id === req.params.id);
    if (propertyIndex === -1) {
      return res.status(404).json({ error: "Property not found" });
    }

    const validatedData = PropertySchema.parse(req.body);
    
    const updatedProperty = {
      ...properties[propertyIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    properties[propertyIndex] = updatedProperty;

    res.json({
      success: true,
      message: "Property updated successfully",
      data: updatedProperty
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /properties/:id - Delete property
app.delete('/properties/:id', (req, res) => {
  const propertyIndex = properties.findIndex(p => p.id === req.params.id);
  if (propertyIndex === -1) {
    return res.status(404).json({ error: "Property not found" });
  }

  // Also delete associated rooms
  rooms = rooms.filter(r => r.propertyId !== req.params.id);
  
  const deletedProperty = properties.splice(propertyIndex, 1)[0];
  
  res.json({
    success: true,
    message: "Property deleted successfully",
    data: deletedProperty
  });
});

// POST /properties - Create new property
app.post('/properties', async (req, res) => {
  try {
    // Validate request body
    const validatedData = PropertySchema.parse(req.body);
    
    // Create new property with generated ID
    const newProperty = {
      id: uuidv4(),
      title: validatedData.title,
      address: validatedData.location, // Map location to address
      price: validatedData.price,
      priceType: validatedData.priceType,
      propertyType: validatedData.type,
      bedrooms: validatedData.beds,
      bathrooms: validatedData.baths,
      squareFeet: validatedData.squareFeet,
      description: validatedData.description,
      imageUrl: validatedData.imageUrl,
      contactPhone: validatedData.contactPhone,
      contactEmail: validatedData.contactEmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store property (in production, save to database)
    properties.push(newProperty);

    // Return created property with 201 status
    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: newProperty
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }

    console.error('Error creating property:', error);
    res.status(500).json({
      error: "Internal server error",
      message: "Failed to create property"
    });
  }
});

// ROOM MANAGEMENT ENDPOINTS

// GET /properties/:propertyId/rooms - Get all rooms for a property
app.get('/properties/:propertyId/rooms', (req, res) => {
  const propertyRooms = rooms.filter(r => r.propertyId === req.params.propertyId);
  res.json({
    success: true,
    data: propertyRooms,
    count: propertyRooms.length
  });
});

// POST /properties/:propertyId/rooms - Add room to property
app.post('/properties/:propertyId/rooms', async (req, res) => {
  try {
    const property = properties.find(p => p.id === req.params.propertyId);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    const validatedData = RoomSchema.parse({
      ...req.body,
      propertyId: req.params.propertyId
    });
    
    const newRoom = {
      id: uuidv4(),
      ...validatedData,
      isAvailable: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    rooms.push(newRoom);

    res.status(201).json({
      success: true,
      message: "Room added successfully",
      data: newRoom
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /rooms/:id - Update room
app.put('/rooms/:id', async (req, res) => {
  try {
    const roomIndex = rooms.findIndex(r => r.id === req.params.id);
    if (roomIndex === -1) {
      return res.status(404).json({ error: "Room not found" });
    }

    const validatedData = RoomSchema.parse(req.body);
    
    const updatedRoom = {
      ...rooms[roomIndex],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    rooms[roomIndex] = updatedRoom;

    res.json({
      success: true,
      message: "Room updated successfully",
      data: updatedRoom
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /rooms/:id - Delete room
app.delete('/rooms/:id', (req, res) => {
  const roomIndex = rooms.findIndex(r => r.id === req.params.id);
  if (roomIndex === -1) {
    return res.status(404).json({ error: "Room not found" });
  }

  const deletedRoom = rooms.splice(roomIndex, 1)[0];
  
  res.json({
    success: true,
    message: "Room deleted successfully",
    data: deletedRoom
  });
});

// RESERVATION MANAGEMENT ENDPOINTS

// GET /reservations - Get all reservations
app.get('/reservations', (req, res) => {
  const { propertyId, status, checkIn, checkOut } = req.query;
  let filteredReservations = reservations;

  if (propertyId) {
    filteredReservations = filteredReservations.filter(r => r.propertyId === propertyId);
  }
  if (status) {
    filteredReservations = filteredReservations.filter(r => r.status === status);
  }
  if (checkIn) {
    filteredReservations = filteredReservations.filter(r => r.checkIn >= checkIn);
  }
  if (checkOut) {
    filteredReservations = filteredReservations.filter(r => r.checkOut <= checkOut);
  }

  res.json({
    success: true,
    data: filteredReservations,
    count: filteredReservations.length
  });
});

// POST /reservations - Create new reservation
app.post('/reservations', async (req, res) => {
  try {
    const validatedData = ReservationSchema.parse(req.body);
    
    // Check if room exists and is available
    const room = rooms.find(r => r.id === validatedData.roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Calculate total amount (simplified)
    const checkInDate = new Date(validatedData.checkIn);
    const checkOutDate = new Date(validatedData.checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalAmount = nights * room.baseRate;
    
    const newReservation = {
      id: uuidv4(),
      ...validatedData,
      totalAmount,
      status: 'confirmed',
      paymentStatus: 'pending',
      source: 'direct',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    reservations.push(newReservation);

    res.status(201).json({
      success: true,
      message: "Reservation created successfully",
      data: newReservation
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT /reservations/:id - Update reservation
app.put('/reservations/:id', (req, res) => {
  const reservationIndex = reservations.findIndex(r => r.id === req.params.id);
  if (reservationIndex === -1) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  const updatedReservation = {
    ...reservations[reservationIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  reservations[reservationIndex] = updatedReservation;

  res.json({
    success: true,
    message: "Reservation updated successfully",
    data: updatedReservation
  });
});

// DELETE /reservations/:id - Cancel reservation
app.delete('/reservations/:id', (req, res) => {
  const reservationIndex = reservations.findIndex(r => r.id === req.params.id);
  if (reservationIndex === -1) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  reservations[reservationIndex].status = 'cancelled';
  reservations[reservationIndex].updatedAt = new Date().toISOString();

  res.json({
    success: true,
    message: "Reservation cancelled successfully",
    data: reservations[reservationIndex]
  });
});

// REPORTING ENDPOINTS

// GET /reports/occupancy - Get occupancy report
app.get('/reports/occupancy', (req, res) => {
  const { propertyId, startDate, endDate } = req.query;
  
  let propertyReservations = reservations;
  if (propertyId) {
    propertyReservations = propertyReservations.filter(r => r.propertyId === propertyId);
  }
  
  const totalRooms = rooms.filter(r => !propertyId || r.propertyId === propertyId).length;
  const occupiedRooms = propertyReservations.filter(r => r.status === 'confirmed' || r.status === 'checked-in').length;
  const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms * 100).toFixed(2) : 0;
  
  res.json({
    success: true,
    data: {
      totalRooms,
      occupiedRooms,
      occupancyRate: parseFloat(occupancyRate),
      availableRooms: totalRooms - occupiedRooms
    }
  });
});

// GET /reports/revenue - Get revenue report
app.get('/reports/revenue', (req, res) => {
  const { propertyId, startDate, endDate } = req.query;
  
  let propertyReservations = reservations;
  if (propertyId) {
    propertyReservations = propertyReservations.filter(r => r.propertyId === propertyId);
  }
  
  const totalRevenue = propertyReservations
    .filter(r => r.status === 'confirmed' || r.status === 'checked-in' || r.status === 'checked-out')
    .reduce((sum, r) => sum + r.totalAmount, 0);
  
  const averageRate = propertyReservations.length > 0 
    ? totalRevenue / propertyReservations.length 
    : 0;
  
  res.json({
    success: true,
    data: {
      totalRevenue,
      averageRate: parseFloat(averageRate.toFixed(2)),
      totalBookings: propertyReservations.length,
      confirmedBookings: propertyReservations.filter(r => r.status === 'confirmed').length
    }
  });
});

// USER MANAGEMENT ENDPOINTS

// GET /users - Get all users
app.get('/users', (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length
  });
});

// GET /organizations - Get all organizations
app.get('/organizations', (req, res) => {
  res.json({
    success: true,
    data: organizations,
    count: organizations.length
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong"
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: "Route not found",
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Hotel Management Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🏨 Properties API: http://localhost:${PORT}/properties`);
  console.log(`🛏️  Rooms API: http://localhost:${PORT}/properties/:id/rooms`);
  console.log(`📅 Reservations API: http://localhost:${PORT}/reservations`);
  console.log(`📊 Reports API: http://localhost:${PORT}/reports`);
  console.log(`👥 Users API: http://localhost:${PORT}/users`);
});

export default app;
