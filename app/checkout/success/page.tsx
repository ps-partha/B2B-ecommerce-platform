import type { Metadata } from "next"
import SuccessClient from "./success-client"

export const metadata: Metadata = {
  title: "Order Confirmed | SecureTrade",
  description: "Your order has been confirmed",
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { orderId?: string }
}) {
  const orderId = searchParams.orderId || "Unknown"
  return <SuccessClient orderId={orderId} />
}
