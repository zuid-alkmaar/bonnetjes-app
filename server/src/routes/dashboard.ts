import { Router, Request, Response } from 'express';
import { prisma } from '../app';

const router = Router();

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get today's orders
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    // Get total revenue (from all orders)
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      }
    });

    // Get active products count
    const activeProducts = await prisma.product.count({
      where: {
        isActive: true
      }
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    // Get top selling products (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      },
      _sum: {
        quantity: true
      },
      _count: {
        id: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        return {
          product,
          totalQuantity: item._sum.quantity,
          orderCount: item._count.id
        };
      })
    );

    // Get revenue by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyRevenue = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _sum: {
        totalAmount: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const stats = {
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenueResult._sum.totalAmount || 0,
      activeProducts,
      recentOrders,
      topProducts: topProductsWithDetails,
      dailyRevenue: dailyRevenue.map(day => ({
        date: day.createdAt.toISOString().split('T')[0],
        revenue: day._sum.totalAmount || 0
      }))
    };

    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// GET /api/dashboard/revenue - Get revenue analytics
router.get('/revenue', async (req: Request, res: Response) => {
  try {
    const { period = '7d' } = req.query;
    
    let startDate = new Date();
    
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        totalAmount: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    const revenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);
    const orderCount = orders.length;
    const averageOrderValue = orderCount > 0 ? revenue / orderCount : 0;

    res.json({
      period,
      revenue,
      orderCount,
      averageOrderValue,
      orders: orders.map(order => ({
        amount: order.totalAmount,
        date: order.createdAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({ error: 'Failed to fetch revenue analytics' });
  }
});

export default router;
