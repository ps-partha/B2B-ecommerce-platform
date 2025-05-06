import type { Metadata } from "next"
import CartClient from "./cart-client"

export const metadata: Metadata = {
  title: "Your Cart | SecureTrade",
  description: "View and manage items in your shopping cart",
}

export default function CartPage() {
  return <CartClient />
}
