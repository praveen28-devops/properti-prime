# PropertyPrime

A comprehensive real estate management platform built with React, TypeScript, and Express.js.

## Features

- **Property Listings** - Browse and search property listings
- **Add Properties** - Create new property listings with detailed information
- **REST API** - Full backend API for property management
- **Responsive Design** - Modern UI with Tailwind CSS
- **Real-time Updates** - Automatic list updates when properties are added

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Tailwind CSS for styling
- React Query for state management
- Radix UI components
- Vite for development

**Backend:**
- Express.js server
- Zod for validation
- CORS enabled
- Rate limiting and security headers

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install server dependencies:**
```bash
cd server
npm install
```

3. **Start the API server:**
```bash
cd server
npm start
```

4. **Start the frontend (in a new terminal):**
```bash
npm run dev
```

## Usage

- **Frontend:** http://localhost:8080 (or 8081 if 8080 is busy)
- **API Server:** http://localhost:3001
- **API Health Check:** http://localhost:3001/health

## API Endpoints

- `GET /properties` - Fetch all properties
- `POST /properties` - Create new property
- `GET /properties/:id` - Get specific property
- `GET /health` - Server health check

## Project Structure

```
properti-prime/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API service layer
│   └── pages/             # Page components
├── server/                # Backend API server
│   ├── server.js          # Express server
│   ├── package.json       # Server dependencies
│   └── .env              # Environment variables
└── public/               # Static assets
```

## Development

### Adding New Properties
1. Click "Add Property" button in the UI
2. Fill out the form with property details
3. Submit to create via POST API
4. List automatically updates with new property

### API Integration
The frontend uses React Query for efficient data fetching and caching. All API calls go through the service layer in `src/services/api.ts`.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own purposes.
