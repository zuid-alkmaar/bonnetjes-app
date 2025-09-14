import express from 'express';
import { prisma } from '../app';

const router = express.Router();

// Dashboard page
router.get('/', async (req, res) => {
  try {
    const [orders, products, stats] = await Promise.all([
      prisma.order.findMany({
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        _count: true
      })
    ]);

    const totalRevenue = stats._sum.totalAmount || 0;
    const totalOrders = stats._count || 0;
    const totalProducts = products.length;

    res.render('dashboard', {
      title: 'Dashboard - Bonnetjes Cafe',
      orders,
      products,
      stats: {
        totalRevenue,
        totalOrders,
        totalProducts
      }
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to load dashboard',
      message: 'Please try again later.'
    });
  }
});

// Orders page
router.get('/orders', async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.render('orders', {
      title: 'Orders - Bonnetjes Cafe',
      orders
    });
  } catch (error) {
    console.error('Error loading orders:', error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to load orders',
      message: 'Please try again later.'
    });
  }
});

// Products page
router.get('/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.render('products', {
      title: 'Products - Bonnetjes Cafe',
      products
    });
  } catch (error) {
    console.error('Error loading products:', error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to load products',
      message: 'Please try again later.'
    });
  }
});

// Create order page
router.get('/orders/new', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.render('create-order', {
      title: 'Create Order - Bonnetjes Cafe',
      products
    });
  } catch (error) {
    console.error('Error loading create order page:', error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to load create order page',
      message: 'Please try again later.'
    });
  }
});

// View order page
router.get('/orders/:id', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    const [order, products] = await Promise.all([
      prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      }),
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' }
      })
    ]);

    if (!order) {
      return res.status(404).render('error', {
        title: '404 - Order Not Found',
        error: 'Order not found',
        message: `Order with ID ${orderId} could not be found.`
      });
    }

    res.render('view-order', {
      title: `Order #${order.id} - Bonnetjes Cafe`,
      order,
      products
    });
  } catch (error) {
    console.error('Error loading order:', error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to load order',
      message: 'Please try again later.'
    });
  }
});

// Handle order creation
router.post('/orders', async (req, res) => {
  try {
    const { customerName, orderItems } = req.body;
    
    if (!customerName || !orderItems || orderItems.length === 0) {
      return res.status(400).render('error', {
        title: 'Error',
        error: 'Invalid order data',
        message: 'Customer name and order items are required.'
      });
    }

    // Calculate total
    let total = 0;
    for (const item of orderItems) {
      total += item.quantity * item.price;
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customerName,
        totalAmount: total,
        orderItems: {
          create: orderItems.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    res.redirect(`/orders/${order.id}`);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to create order',
      message: 'Please try again later.'
    });
  }
});

// Handle order deletion
router.post('/orders/:id/delete', async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    
    await prisma.order.delete({
      where: { id: orderId }
    });

    res.redirect('/orders');
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).render('error', {
      title: 'Error',
      error: 'Failed to delete order',
      message: 'Please try again later.'
    });
  }
});

// Update order (PUT endpoint for AJAX)
router.put('/orders/:id', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const { customerName, orderItems } = req.body;

    // Validate input
    if (!customerName || !orderItems || !Array.isArray(orderItems)) {
      return res.status(400).json({
        error: 'Invalid order data',
        message: 'Customer name and order items are required.'
      });
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of orderItems) {
      totalAmount += item.quantity * item.price;
    }

    // Update order in a transaction
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Delete existing order items
      await tx.orderItem.deleteMany({
        where: { orderId: orderId }
      });

      // Update order and create new items
      return await tx.order.update({
        where: { id: orderId },
        data: {
          customerName,
          totalAmount,
          orderItems: {
            create: orderItems.map((item: any) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }))
          }
        },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      error: 'Server Error',
      message: 'An error occurred while updating the order.'
    });
  }
});

export default router;
