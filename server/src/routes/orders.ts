import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../app';

const router = Router();

// Validation schemas
const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive(),
  price: z.number().positive()
});

const createOrderSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required'),
  orderItems: z.array(orderItemSchema).min(1, 'At least one order item is required')
});

const updateOrderSchema = z.object({
  customerName: z.string().min(1).optional(),
  orderItems: z.array(orderItemSchema).optional()
});

// GET /api/orders - Get all orders
router.get('/', async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// POST /api/orders - Create new order
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createOrderSchema.parse(req.body);
    const { customerName, orderItems } = validatedData;

    // Calculate total amount
    let totalAmount = 0;
    for (const item of orderItems) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      if (product) {
        totalAmount += product.price * item.quantity;
      }
    }

    // Create order with order items
    const order = await prisma.order.create({
      data: {
        customerName,
        totalAmount,
        orderItems: {
          create: orderItems.map(item => ({
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

    res.status(201).json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// PUT /api/orders/:id - Update order
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const validatedData = updateOrderSchema.parse(req.body);
    const { customerName, orderItems } = validatedData;

    // If updating order items, recalculate total
    let updateData: any = {};
    
    if (customerName) {
      updateData.customerName = customerName;
    }

    if (orderItems) {
      // Calculate new total amount
      let totalAmount = 0;
      for (const item of orderItems) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId }
        });
        if (product) {
          totalAmount += product.price * item.quantity;
        }
      }
      
      updateData.totalAmount = totalAmount;
      
      // Delete existing order items and create new ones
      await prisma.orderItem.deleteMany({
        where: { orderId: id }
      });
      
      updateData.orderItems = {
        create: orderItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      };
    }

    const order = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });

    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// DELETE /api/orders/:id - Delete order
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    await prisma.order.delete({
      where: { id }
    });

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// POST /api/orders/:id/items - Add item to order
router.post('/:id/items', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);

    if (isNaN(orderId)) {
      return res.status(400).json({ error: 'Invalid order ID' });
    }

    const validatedData = orderItemSchema.parse(req.body);

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Create order item
    const orderItem = await prisma.orderItem.create({
      data: {
        orderId,
        productId: validatedData.productId,
        quantity: validatedData.quantity,
        price: validatedData.price
      },
      include: {
        product: true
      }
    });

    // Update order total
    await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: {
          increment: validatedData.price * validatedData.quantity
        }
      }
    });

    res.status(201).json(orderItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Error adding order item:', error);
    res.status(500).json({ error: 'Failed to add order item' });
  }
});

// PUT /api/orders/:id/items/:itemId - Update order item
router.put('/:id/items/:itemId', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const itemId = parseInt(req.params.itemId);

    if (isNaN(orderId) || isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid order or item ID' });
    }

    const validatedData = orderItemSchema.parse(req.body);

    // Get current order item to calculate price difference
    const currentItem = await prisma.orderItem.findUnique({
      where: { id: itemId }
    });

    if (!currentItem || currentItem.orderId !== orderId) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    // Update order item
    const orderItem = await prisma.orderItem.update({
      where: { id: itemId },
      data: {
        productId: validatedData.productId,
        quantity: validatedData.quantity,
        price: validatedData.price
      },
      include: {
        product: true
      }
    });

    // Update order total
    const oldTotal = currentItem.price * currentItem.quantity;
    const newTotal = validatedData.price * validatedData.quantity;
    const difference = newTotal - oldTotal;

    await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: {
          increment: difference
        }
      }
    });

    res.json(orderItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.errors
      });
    }

    console.error('Error updating order item:', error);
    res.status(500).json({ error: 'Failed to update order item' });
  }
});

// DELETE /api/orders/:id/items/:itemId - Remove item from order
router.delete('/:id/items/:itemId', async (req: Request, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    const itemId = parseInt(req.params.itemId);

    if (isNaN(orderId) || isNaN(itemId)) {
      return res.status(400).json({ error: 'Invalid order or item ID' });
    }

    // Get order item to calculate price reduction
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: itemId }
    });

    if (!orderItem || orderItem.orderId !== orderId) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    // Delete order item
    await prisma.orderItem.delete({
      where: { id: itemId }
    });

    // Update order total
    const reduction = orderItem.price * orderItem.quantity;
    await prisma.order.update({
      where: { id: orderId },
      data: {
        totalAmount: {
          decrement: reduction
        }
      }
    });

    res.json({ message: 'Order item removed successfully' });
  } catch (error) {
    console.error('Error removing order item:', error);
    res.status(500).json({ error: 'Failed to remove order item' });
  }
});

export default router;
