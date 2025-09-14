# Architecture Overview

## System Architecture

The Bonnetjes Cafe Order Management System has been successfully separated into a clean frontend/backend architecture:

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐
│   Frontend      │ ◄──────────────► │   Backend       │
│   (Next.js)     │                 │   (Express.js)  │
│   Port 3000     │                 │   Port 3001     │
└─────────────────┘                 └─────────────────┘
                                            │
                                            ▼
                                    ┌─────────────────┐
                                    │   Database      │
                                    │   (SQLite)      │
                                    │   dev.db        │
                                    └─────────────────┘
```

## Frontend (Next.js Application)

**Location**: Root directory  
**Port**: 3000  
**Technology Stack**:
- Next.js 15 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- React components for UI

**Key Components**:
- `src/components/DashboardPage.tsx` - Dashboard with statistics
- `src/components/OrdersPage.tsx` - Order management interface
- `src/components/ProductsPage.tsx` - Product catalog management
- `src/components/CreateOrderPage.tsx` - New order creation
- `src/components/OrderViewPage.tsx` - Order details and editing
- `src/lib/api.ts` - API client for backend communication

**Features**:
- Mobile-responsive design
- Real-time data updates
- Dynamic order editing
- Product management
- Dashboard analytics

## Backend (Express.js API Server)

**Location**: `server/` directory  
**Port**: 3001  
**Technology Stack**:
- Express.js web framework
- TypeScript for type safety
- Prisma ORM for database access
- Zod for input validation
- SQLite database

**Key Files**:
- `server/src/index.ts` - Main server entry point
- `server/src/routes/products.ts` - Product CRUD operations
- `server/src/routes/orders.ts` - Order CRUD operations
- `server/src/routes/dashboard.ts` - Dashboard statistics
- `server/prisma/schema.prisma` - Database schema

**API Endpoints**:

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

### Health Check
- `GET /health` - Server health status

## Database Schema

**Technology**: SQLite with Prisma ORM  
**Location**: `server/dev.db`

**Tables**:
- `Product` - Menu items with pricing and categories
- `Order` - Customer orders with totals and timestamps
- `OrderItem` - Individual items within orders

**Relationships**:
- Order → OrderItem (One-to-Many)
- Product → OrderItem (One-to-Many)

## Communication Flow

1. **Frontend Request**: User interacts with React components
2. **API Client**: `src/lib/api.ts` makes HTTP requests to backend
3. **Express Router**: Backend routes handle requests
4. **Prisma ORM**: Database operations through type-safe queries
5. **Response**: JSON data returned to frontend
6. **UI Update**: React components re-render with new data

## Development Workflow

### Starting the Application

1. **Start Backend Server**:
   ```bash
   cd server
   npm run dev
   ```
   Server runs on `http://localhost:3001`

2. **Start Frontend Application**:
   ```bash
   npm run dev
   ```
   Application runs on `http://localhost:3000`

### Making Changes

**Frontend Changes**:
- Edit React components in `src/components/`
- Update API client in `src/lib/api.ts`
- Modify styles with Tailwind CSS

**Backend Changes**:
- Edit routes in `server/src/routes/`
- Update database schema in `server/prisma/schema.prisma`
- Run `npx prisma db push` after schema changes

## Benefits of This Architecture

### Separation of Concerns
- Frontend focuses on UI/UX
- Backend handles business logic and data
- Clear API contract between layers

### Scalability
- Frontend and backend can be deployed independently
- API can serve multiple clients (web, mobile, etc.)
- Database can be easily migrated to cloud providers

### Development Experience
- Hot reload for both frontend and backend
- Type safety across the entire stack
- Clear error boundaries and debugging

### Deployment Flexibility
- Frontend can be deployed to Vercel, Netlify, etc.
- Backend can be deployed to any Node.js hosting
- Database can be SQLite, PostgreSQL, MySQL, etc.

## Environment Configuration

**Frontend** (`.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend** (`server/.env`):
```env
DATABASE_URL="file:./dev.db"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## Security Features

- **CORS**: Configured to allow frontend domain only
- **Helmet.js**: Security headers for Express server
- **Input Validation**: Zod schemas validate all API inputs
- **SQL Injection Protection**: Prisma ORM prevents SQL injection
- **Type Safety**: TypeScript prevents runtime errors

## Testing

**API Testing**:
```bash
# Health check
curl http://localhost:3001/health

# Get products
curl http://localhost:3001/api/products

# Get orders
curl http://localhost:3001/api/orders
```

**Frontend Testing**:
- Navigate to `http://localhost:3000`
- Test all CRUD operations through the UI
- Verify mobile responsiveness

This architecture provides a solid foundation for a production-ready cafe order management system with clear separation of concerns, type safety, and excellent developer experience.
