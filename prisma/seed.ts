import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  // Clear existing categories first (optional)
  await prisma.category.deleteMany({})

  // Insert categories
  const categories = [
    {
      name: "Gaming Accounts",
      slug: "gaming-accounts",
      description: "Buy and sell gaming accounts for popular games",
      icon: "gamepad",
    },
    {
      name: "Social Media Accounts",
      slug: "social-media-accounts",
      description: "Social media accounts with established followers",
      icon: "users",
    },
    {
      name: "Digital Products",
      slug: "digital-products",
      description: "Digital goods including software, ebooks, and more",
      icon: "file",
    },
    {
      name: "Services",
      slug: "services",
      description: "Digital services including design, development, and marketing",
      icon: "briefcase",
    },
    {
      name: "Domains & Websites",
      slug: "domains-websites",
      description: "Established domains and websites for sale",
      icon: "globe",
    },
    {
      name: "Subscriptions",
      slug: "subscriptions",
      description: "Premium subscription accounts for various platforms",
      icon: "credit-card",
    },
    {
      name: "Virtual Items",
      slug: "virtual-items",
      description: "In-game items, skins, and virtual collectibles",
      icon: "package",
    },
    {
      name: "Other",
      slug: "other",
      description: "Other digital products and services",
      icon: "more-horizontal",
    },
  ]

  for (const category of categories) {
    await prisma.category.create({
      data: category,
    })
  }

  console.log("Categories seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
