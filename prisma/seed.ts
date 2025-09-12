import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  // Create products
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Espresso",
        price: 2.50,
        category: "Coffee",
        description: "Strong black coffee shot",
        isActive: true
      },
      {
        name: "Cappuccino",
        price: 3.50,
        category: "Coffee",
        description: "Espresso with steamed milk and foam",
        isActive: true
      },
      {
        name: "Latte",
        price: 4.00,
        category: "Coffee",
        description: "Espresso with steamed milk",
        isActive: true
      },
      {
        name: "Americano",
        price: 3.00,
        category: "Coffee",
        description: "Espresso with hot water",
        isActive: true
      },
      {
        name: "Mocha",
        price: 4.50,
        category: "Coffee",
        description: "Espresso with chocolate and steamed milk",
        isActive: true
      },
      {
        name: "Croissant",
        price: 3.25,
        category: "Pastry",
        description: "Buttery flaky pastry",
        isActive: true
      },
      {
        name: "Muffin - Blueberry",
        price: 2.75,
        category: "Pastry",
        description: "Fresh blueberry muffin",
        isActive: true
      },
      {
        name: "Danish - Cheese",
        price: 3.50,
        category: "Pastry",
        description: "Flaky pastry with cream cheese",
        isActive: true
      },
      {
        name: "Sandwich - Ham & Cheese",
        price: 6.50,
        category: "Food",
        description: "Ham and cheese on fresh bread",
        isActive: true
      },
      {
        name: "Sandwich - Turkey Club",
        price: 7.25,
        category: "Food",
        description: "Turkey, bacon, lettuce, tomato",
        isActive: true
      },
      {
        name: "Bagel with Cream Cheese",
        price: 4.00,
        category: "Food",
        description: "Fresh bagel with cream cheese",
        isActive: true
      },
      {
        name: "Green Tea",
        price: 2.25,
        category: "Tea",
        description: "Premium green tea",
        isActive: true
      },
      {
        name: "Earl Grey",
        price: 2.50,
        category: "Tea",
        description: "Classic Earl Grey tea",
        isActive: true
      },
      {
        name: "Orange Juice",
        price: 3.75,
        category: "Beverage",
        description: "Fresh squeezed orange juice",
        isActive: true
      },
      {
        name: "Sparkling Water",
        price: 2.00,
        category: "Beverage",
        description: "Refreshing sparkling water",
        isActive: true
      }
    ]
  })

  // Get created products for orders
  const allProducts = await prisma.product.findMany()
  
  // Create sample orders
  const order1 = await prisma.order.create({
    data: {
      customerName: "John Doe",
      totalAmount: 15.50,
      isPaid: false,
      orderItems: {
        create: [
          {
            productId: allProducts[0].id, // Espresso
            quantity: 2,
            price: allProducts[0].price
          },
          {
            productId: allProducts[5].id, // Croissant
            quantity: 1,
            price: allProducts[5].price
          }
        ]
      }
    }
  })

  const order2 = await prisma.order.create({
    data: {
      customerName: "Jane Smith",
      totalAmount: 23.75,
      isPaid: true,
      orderItems: {
        create: [
          {
            productId: allProducts[1].id, // Cappuccino
            quantity: 2,
            price: allProducts[1].price
          },
          {
            productId: allProducts[8].id, // Ham & Cheese Sandwich
            quantity: 1,
            price: allProducts[8].price
          }
        ]
      }
    }
  })

  const order3 = await prisma.order.create({
    data: {
      customerName: "Bob Johnson",
      totalAmount: 8.25,
      isPaid: false,
      orderItems: {
        create: [
          {
            productId: allProducts[2].id, // Latte
            quantity: 1,
            price: allProducts[2].price
          },
          {
            productId: allProducts[6].id, // Blueberry Muffin
            quantity: 1,
            price: allProducts[6].price
          }
        ]
      }
    }
  })

  console.log('Database seeded successfully!')
  console.log(`Created ${products.count} products`)
  console.log(`Created 3 sample orders`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
