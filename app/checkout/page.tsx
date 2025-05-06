import type { Metadata } from "next"
import CheckoutClient from "./checkout-client"

export const metadata: Metadata = {
  title: "Checkout | SecureTrade",
  description: "Complete your purchase securely",
}

export default function CheckoutPage() {
  return <CheckoutClient />
}
