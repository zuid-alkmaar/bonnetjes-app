import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get total orders
    const totalOrders = await prisma.order.count()

    // Get today's orders
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayOrders = await prisma.order.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    })

    // Get total revenue (from all orders)
    const totalRevenueResult = await prisma.order.aggregate({
      _sum: {
        totalAmount: true
      }
    })

    // Get active products count
    const activeProducts = await prisma.product.count({
      where: {
        isActive: true
      }
    })

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
    })

    const stats = {
      totalOrders,
      todayOrders,
      totalRevenue: totalRevenueResult._sum.totalAmount || 0,
      activeProducts,
      recentOrders
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard stats' },
      { status: 500 }
    )
  }
}
