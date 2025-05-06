"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Badge } from "@/components/ui/badge"

export default function CartIcon() {
  const { getItemsCount } = useCart()
  const itemsCount = getItemsCount()

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingCart className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
        {itemsCount > 0 && (
          <Badge className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-primary-foreground">
            {itemsCount > 99 ? "99+" : itemsCount}
          </Badge>
        )}
      </Button>
    </Link>
  )
}
