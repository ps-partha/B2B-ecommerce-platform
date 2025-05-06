import type { NextRequest } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"

// Get all orders for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const limit = Math.max(1, Number(searchParams.get("limit") || "10"));
    const type = searchParams.get("type") || "all"; // "purchases", "sales", "all"
    const status = searchParams.get("status");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (type === "purchases") {
      where.buyerId = userId;
    } else if (type === "sales") {
      where.sellerId = userId;
    } else {
      where.OR = [{ buyerId: userId }, { sellerId: userId }];
    }

    if (status && status !== "all") {
      where.status = status;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          buyer: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
              isVerified: true,
            },
          },
          seller: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                  username: true,
                  avatar: true,
                  isVerified: true,
                },
              },
            },
          },
          listing: {
            include: {
              images: {
                where: { isMain: true },
                take: 1,
              },
            },
          },
          review: {
            select: {
              id: true,
              rating: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return Response.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "USER") {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)
    const body = await request.json()
    const { listingId, paymentMethod } = body

    console.log(listingId)

    // Validate input
    if (!listingId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if listing exists and is available
    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
        status: "ACTIVE",
      },
      include: {
        seller: true,
      },
    })

    if (!listing) {
      return Response.json({ error: "Listing not found or not available" }, { status: 404 })
    }

    // Prevent buying own listing
    if (listing.sellerId === userId) {
      return Response.json({ error: "Cannot purchase your own listing" }, { status: 400 })
    }

    // Calculate fees
    const platformFee = Number.parseFloat(((Number(listing.price) || 0) * 0.05).toFixed(2)) // 5% platform fee
    const transactionFee = Number.parseFloat((Number(listing.price) * 0.02).toFixed(2)) // 2% transaction fee
    const totalAmount = Number.parseFloat((Number(listing.price) + platformFee + transactionFee).toFixed(2))

    // Generate order number
    const orderNumber = `ORD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        buyerId: userId,
        sellerId: listing.sellerId,
        listingId,
        totalAmount,
        platformFee,
        transactionFee,
        paymentMethod,
        status: "PENDING",
        paymentStatus: "PENDING",
      },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            avatar: true,
          },
        },
        listing: true,
      },
    })

    // Create notifications for buyer and seller
    await prisma.notification.createMany({
      data: [
        {
          userId: userId,
          type: "ORDER",
          title: "Order Created",
          message: `Your order #${orderNumber} has been created and is pending payment.`,
        },
        {
          userId: listing.sellerId,
          type: "ORDER",
          title: "New Order Received",
          message: `You have received a new order #${orderNumber} for "${listing.title}".`,
        },
      ],
    })

    return Response.json({ order, message: "Order created successfully" }, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return Response.json({ error: "Failed to create order" }, { status: 500 })
  }
}
