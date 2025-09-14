import express from 'express';
import path from 'path';
import morgan from 'morgan';
import expressLayouts from 'express-ejs-layouts';
import { PrismaClient } from '@prisma/client';

// Import routes
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import dashboardRoutes from './routes/dashboard';
import webRoutes from './routes/web';

// Initialize Prisma client
export const prisma = new PrismaClient();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files
app.use(express.static(path.join(__dirname, '../public')));

// Middleware
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Web routes (HTML pages)
app.use('/', webRoutes);

// API routes (JSON responses)
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  if (req.path.startsWith('/api/')) {
    res.status(500).json({ error: 'Something went wrong!' });
  } else {
    res.status(500).render('error', { 
      title: 'Error',
      error: 'Something went wrong!',
      message: err.message 
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ 
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`
    });
  } else {
    res.status(404).render('error', { 
      title: '404 - Page Not Found',
      error: 'Page not found',
      message: `The page ${req.originalUrl} could not be found.`
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down server...');
  await prisma.$disconnect();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Web interface: http://localhost:${PORT}`);
});
