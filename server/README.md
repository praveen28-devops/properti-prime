# Properti Prime API Server

Backend API server for the Properti Prime property management application.

## Features

- **POST /properties** - Create new property listings
- **GET /properties** - Retrieve all properties
- **GET /properties/:id** - Retrieve specific property by ID
- Input validation using Zod
- CORS enabled for frontend integration
- Rate limiting for API protection
- Helmet for security headers

## API Endpoints

### POST /properties
Creates a new property listing.

**Request Body:**
```json
{
  "title": "Modern Apartment",
  "price": 2500,
  "location": "123 Main St, City, State",
  "type": "apartment",
  "beds": 2,
  "baths": 1.5,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": "uuid-generated-id",
    "title": "Modern Apartment",
    "address": "123 Main St, City, State",
    "price": 2500,
    "priceType": "rent",
    "propertyType": "apartment",
    "bedrooms": 2,
    "bathrooms": 1.5,
    "squareFeet": 1000,
    "description": "",
    "imageUrl": "https://example.com/image.jpg",
    "contactPhone": null,
    "contactEmail": null,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

## Installation

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on port 3001 by default.

## Environment Variables

- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:5173)
- `NODE_ENV` - Environment mode (development/production)

## Validation Rules

- **title**: Required string, 1-200 characters
- **price**: Required positive number
- **location**: Required string, 1-300 characters
- **type**: Optional, one of: apartment, house, condo, townhouse (default: apartment)
- **beds**: Optional positive integer (default: 1)
- **baths**: Optional positive number (default: 1)
- **imageUrl**: Optional valid URL
