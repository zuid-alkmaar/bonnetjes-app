import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: {
        id: parseInt(id)
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json()
    const { name, price, category, description, isActive } = body

    const product = await prisma.product.update({
      where: {
        id: parseInt(id)
      },
      data: {
        ...(name && { name }),
        ...(price && { price: parseFloat(price) }),
        ...(category && { category }),
        ...(description && { description }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if product is referenced in any orders
    const orderItems = await prisma.orderItem.findFirst({
      where: {
        productId: parseInt(id)
      }
    });

    if (orderItems) {
      return NextResponse.json(
        { error: 'Cannot delete product that is referenced in orders' },
        { status: 400 }
      )
    }

    await prisma.product.delete({
      where: {
        id: parseInt(id)
      }
    })

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
