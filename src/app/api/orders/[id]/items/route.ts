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

    // Calculate new total amount
    let newTotalAmount = 0;
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (product) {
        newTotalAmount += product.price * item.quantity;
      }
    }

    // Update order items
    await prisma.$transaction(async (tx) => {
      await tx.orderItem.deleteMany({
        where: { orderId: parseInt(id) }
      });

      await Promise.all(
        orderItems.map((item: any) =>
          tx.orderItem.create({
            data: {
              orderId: parseInt(id),
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }
          })
        )
      );

      await tx.order.update({
        where: { id: parseInt(id) },
        data: { totalAmount: newTotalAmount }
      });
    });

    // Return updated order
    const updatedOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order items:', error);
    return NextResponse.json(
      { error: 'Failed to update order items' },
      { status: 500 }
    );
  }
}
