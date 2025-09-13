import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.product.deleteMany()

  // Create products from CSV data
  const products = await prisma.product.createMany({
    data: [
      {
        name: "Alcoholvrij bier",
        price: 2.70,
        category: "Eten en drinken",
        description: "Alcoholvrij bier",
        isActive: true
      },
      {
        name: "Andere koffie",
        price: 2.20,
        category: "Eten en drinken",
        description: "Andere koffie",
        isActive: true
      },
      {
        name: "Bier",
        price: 2.70,
        category: "Eten en drinken",
        description: "Bier",
        isActive: true
      },
      {
        name: "Extra bol ijs",
        price: 1.00,
        category: "Eten en drinken",
        description: "Extra bol ijs",
        isActive: true
      },
      {
        name: "Extra uur zaal 2",
        price: 35.00,
        category: "Extra uren huur zalen",
        description: "Extra uur zaal 2",
        isActive: true
      },
      {
        name: "Extra uur zaal 3",
        price: 35.00,
        category: "Extra uren huur zalen",
        description: "Extra uur zaal 3",
        isActive: true
      },
      {
        name: "Falafel",
        price: 4.50,
        category: "Eten en drinken",
        description: "Falafel",
        isActive: true
      },
      {
        name: "Frisdrank",
        price: 2.20,
        category: "Eten en drinken",
        description: "Frisdrank",
        isActive: true
      },
      {
        name: "Jus d'orange",
        price: 2.70,
        category: "Eten en drinken",
        description: "Jus d'orange",
        isActive: true
      },
      {
        name: "Koffie",
        price: 1.90,
        category: "Eten en drinken",
        description: "Koffie",
        isActive: true
      },
      {
        name: "Los broodje",
        price: 0.50,
        category: "Eten en drinken",
        description: "Los broodje",
        isActive: true
      },
      {
        name: "Ontbijt",
        price: 3.00,
        category: "Eten en drinken",
        description: "Ontbijt",
        isActive: true
      },
      {
        name: "Radler 0%",
        price: 2.70,
        category: "Eten en drinken",
        description: "Radler 0%",
        isActive: true
      },
      {
        name: "Schepijs 1 bol",
        price: 1.50,
        category: "Eten en drinken",
        description: "Schepijs 1 bol",
        isActive: true
      },
      {
        name: "Soep",
        price: 2.00,
        category: "Eten en drinken",
        description: "Soep",
        isActive: true
      },
      {
        name: "Thee",
        price: 1.90,
        category: "Eten en drinken",
        description: "Thee",
        isActive: true
      },
      {
        name: "Warme chocolademelk",
        price: 2.20,
        category: "Eten en drinken",
        description: "Warme chocolademelk",
        isActive: true
      },
      {
        name: "Wijn",
        price: 2.70,
        category: "Eten en drinken",
        description: "Wijn",
        isActive: true
      },
      {
        name: "Zaal 2 per uur",
        price: 35.00,
        category: "Extra uren huur zalen",
        description: "Zaal 2 per uur",
        isActive: true
      },
      {
        name: "Zaal 2 voor 2 uur",
        price: 70.00,
        category: "Extra uren huur zalen",
        description: "Zaal 2 voor 2 uur",
        isActive: true
      },
      {
        name: "Zaal 2 voor 3 uur",
        price: 105.00,
        category: "Extra uren huur zalen",
        description: "Zaal 2 voor 3 uur",
        isActive: true
      },
      {
        name: "Zaal 2 voor 4 uur",
        price: 140.00,
        category: "Extra uren huur zalen",
        description: "Zaal 2 voor 4 uur",
        isActive: true
      },
      {
        name: "Zakje snoep",
        price: 1.00,
        category: "Eten en drinken",
        description: "Zakje snoep",
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
      totalAmount: 5.60,
      orderItems: {
        create: [
          {
            productId: allProducts[9].id, // Koffie
            quantity: 2,
            price: allProducts[9].price
          },
          {
            productId: allProducts[15].id, // Thee
            quantity: 1,
            price: allProducts[15].price
          }
        ]
      }
    }
  })

  const order2 = await prisma.order.create({
    data: {
      customerName: "Jane Smith",
      totalAmount: 7.20,
      orderItems: {
        create: [
          {
            productId: allProducts[8].id, // Jus d'orange
            quantity: 1,
            price: allProducts[8].price
          },
          {
            productId: allProducts[6].id, // Falafel
            quantity: 1,
            price: allProducts[6].price
          }
        ]
      }
    }
  })

  const order3 = await prisma.order.create({
    data: {
      customerName: "Bob Johnson",
      totalAmount: 4.70,
      orderItems: {
        create: [
          {
            productId: allProducts[2].id, // Bier
            quantity: 1,
            price: allProducts[2].price
          },
          {
            productId: allProducts[14].id, // Soep
            quantity: 1,
            price: allProducts[14].price
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
