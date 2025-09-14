# Bonnetjes Cafe API Server

A standalone TypeScript Express server providing REST API endpoints for the Bonnetjes Cafe order management system.

## Features

- **RESTful API**: Complete CRUD operations for products and orders
- **TypeScript**: Full type safety and modern JavaScript features
- **Express.js**: Fast, unopinionated web framework
- **Prisma ORM**: Type-safe database access with SQLite
- **Input Validation**: Zod schema validation for all endpoints
- **CORS Support**: Configurable cross-origin resource sharing
- **Security**: Helmet.js for security headers
- **Logging**: Morgan HTTP request logger
- **Hot Reload**: Development server with automatic restart

## API Endpoints

### Products
- `GET /api/products` - Get all active products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Soft delete product

### Orders
- `GET /api/orders` - Get all orders with items
- `GET /api/orders/:id` - Get order by ID with items
- `POST /api/orders` - Create new order with items
- `PUT /api/orders/:id` - Update order and items
- `DELETE /api/orders/:id` - Delete order and items

### Order Items
- `POST /api/orders/:id/items` - Add item to order
- `PUT /api/orders/:id/items/:itemId` - Update order item
- `DELETE /api/orders/:id/items/:itemId` - Remove item from order

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/revenue` - Get revenue analytics

### Health Check
- `GET /health` - Server health status

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up database:**
   ```bash
   npm run db:push
   npm run db:seed
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Server will be running at:**
   - API: `http://localhost:3001`
   - Health check: `http://localhost:3001/health`

## Environment Variables

Create a `.env` file in the server directory:

```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:seed` - Seed database with sample data
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate Prisma client

## Database Schema

The server uses SQLite with Prisma ORM. The schema includes:

- **Products**: Menu items with name, price, category, description
- **Orders**: Customer orders with total amount and timestamps
- **OrderItems**: Individual items within orders with quantities and prices

## Development

The server is built with:

- **Express.js 4.18+** - Web framework
- **TypeScript 5.3+** - Type safety
- **Prisma 6.16+** - Database ORM
- **Zod 3.22+** - Schema validation
- **tsx** - TypeScript execution for development

## Production Deployment

1. **Build the server:**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Start production server:**
   ```bash
   npm start
   ```

## API Response Format

All API responses follow a consistent format:

**Success Response:**
```json
{
  "data": { ... },
  "status": "success"
}
```

**Error Response:**
```json
{
  "error": "Error message",
  "details": { ... }
}
```

## CORS Configuration

The server is configured to accept requests from the frontend application. Update `CORS_ORIGIN` in your environment variables to match your frontend URL.

## Security Features

- **Helmet.js**: Security headers
- **Input Validation**: All inputs validated with Zod schemas
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **CORS**: Configurable cross-origin resource sharing

## Monitoring

- **Health Check**: `/health` endpoint for monitoring
- **Request Logging**: Morgan HTTP request logger
- **Error Handling**: Centralized error handling middleware
