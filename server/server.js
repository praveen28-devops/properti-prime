import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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
    title: "Modern Downtown Apartment",
    address: "123 Main Street, Downtown, NY 10001",
    price: 3500,
    priceType: "rent",
    propertyType: "apartment",
    bedrooms: 2,
    bathrooms: 2,
    squareFeet: 1200,
    description: "Beautiful modern apartment in the heart of downtown. Features floor-to-ceiling windows, stainless steel appliances, and a private balcony with city views. Walking distance to restaurants, shopping, and public transportation.",
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop",
    contactPhone: "(555) 123-4567",
    contactEmail: "agent@modernproperties.com"
  }
];

// Property validation schema
const PropertySchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  price: z.number().positive("Price must be positive"),
  location: z.string().min(1, "Location is required").max(300, "Location too long"),
  type: z.enum(["apartment", "house", "condo", "townhouse"]).optional().default("apartment"),
  beds: z.number().int().min(0).optional().default(1),
  baths: z.number().min(0).optional().default(1),
  imageUrl: z.string().url().optional(),
  // Additional fields to match existing schema
  priceType: z.enum(["rent", "sale"]).optional().default("rent"),
  squareFeet: z.number().int().min(1).optional().default(1000),
  description: z.string().optional().default(""),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional()
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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
  res.json({
    success: true,
    data: property
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
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/health`);
  console.log(`🏠 Properties API: http://localhost:${PORT}/properties`);
});

export default app;
