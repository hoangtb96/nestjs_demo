# Location Service

A NestJS-based service for managing locations and buildings with a hierarchical structure.

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- PostgreSQL (v12 or higher)

## Installation Guide

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd location-service
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Create a `.env` file in the root directory
   - Add the following environment variables:
     ```env
     PORT=3000
     DB_HOST=localhost
     DB_PORT=5432
     DB_USERNAME=postgres
     DB_PASSWORD=postgres
     DB_DATABASE=location_service
     NODE_ENV=development 
     ```
   - Replace `username`, `password`, and database name as per your PostgreSQL setup

4. **Database Setup**
   ```bash
   # Run database migrations
   npm run migration:run
   ```

## Running the Application

### Development Mode
```bash
# Start the application in development mode
npm run start:dev
```

### Production Mode
```bash
# Build the application
npm run build

# Start the application in production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Available Endpoints

- `GET /locations` - Get all locations
- `GET /locations/tree` - Get location hierarchy tree
- `GET /locations/:id` - Get a specific location
- `GET /locations/:id/children` - Get children of a location
- `GET /locations/:id/parents` - Get parents of a location
- `POST /locations` - Create a new location
- `PUT /locations/:id` - Update a location
- `DELETE /locations/:id` - Delete a location

## Testing

```bash
# Run unit tests
npm run test

# Run e2e tests
npm run test:e2e

# Run test coverage
npm run test:cov
```

## Features

- Location hierarchy management
- Building management
- Swagger API documentation
- Data validation using DTOs
- CQRS pattern implementation
- PostgreSQL database integration

## Support

For any questions or issues, please open an issue in the repository.
