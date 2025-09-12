import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { orderItems } = body;

    // Start a transaction to update order items and total
    const result = await prisma.$transaction(async (tx) => {
      // Delete existing order items
      await tx.orderItem.deleteMany({
        where: { orderId: parseInt(id) }
      });

      // Create new order items
      const newOrderItems = await Promise.all(
        orderItems.map((item: any) =>
          tx.orderItem.create({
            data: {
              orderId: parseInt(id),
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            },
            include: {
              product: true
            }
          })
        )
      );

      // Calculate new total
      const newTotal = newOrderItems.reduce(
        (sum, item) => sum + (item.price * item.quantity),
        0
      );

      // Update order total
      const updatedOrder = await tx.order.update({
        where: { id: parseInt(id) },
        data: { totalAmount: newTotal },
        include: {
          orderItems: {
            include: {
              product: true
            }
          }
        }
      });

      return updatedOrder;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating order items:', error);
    return NextResponse.json(
      { error: 'Failed to update order items' },
      { status: 500 }
    );
  }
}
