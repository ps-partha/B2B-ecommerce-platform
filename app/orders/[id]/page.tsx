import { getServerSession } from "next-auth/next"
import { notFound, redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import prisma from "@/lib/prisma"
import OrderDetails from "@/components/order/order-details"

export default async function OrderDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login?callbackUrl=/dashboard/orders")
  }

  const userId = Number.parseInt(session.user.id)
  const orderId = Number.parseInt(params.id)

  // Fetch order details
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
    },
    include: {
      buyer: {
        select: {
          id: true,
          name: true,
          username: true,
          avatar: true,
          email: true,
          isVerified: true,
        },
      },
      seller: {
        select: {
          id: true,
          user : {
            select: {
              name: true,
              username: true,
              avatar: true,
              email: true,
              isVerified: true,
            }
          }
        },
      },
      listing: {
        include: {
          images: true,
          category: true,
        },
      },
      review: true,
    },
  })

  // Check if order exists and user has access
  if (!order || (order.buyerId !== userId && order.sellerId !== userId)) {
    notFound()
  }

  return <OrderDetails order={order} userId={userId} />
}
