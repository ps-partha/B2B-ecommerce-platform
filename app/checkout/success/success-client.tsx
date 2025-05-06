"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Clock, Download, ShoppingBag } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function SuccessClient({ orderId }: { orderId: string }) {
  return (
    <div className="container mx-auto max-w-md px-4 py-10">
      <Card className="border-2 border-green-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
          <CardDescription>Your order has been successfully placed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Order ID</span>
              <span className="font-mono text-sm">{orderId}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Date</span>
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">What happens next?</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Processing</p>
                  <p className="text-muted-foreground">Your order is being processed by the seller</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ShoppingBag className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="flex-1 text-sm">
                  <p className="font-medium">Delivery</p>
                  <p className="text-muted-foreground">Digital products will be delivered to your account</p>
                </div>
              </li>
            </ul>
          </div>

          <Separator />

          <div className="rounded-lg bg-muted/50 p-4 text-center">
            <p className="text-sm">
              We've sent a confirmation email to your registered email address with all the details of your order.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" asChild>
            <Link href="/dashboard/orders">View Order Details</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/marketplace">
              <Download className="mr-2 h-4 w-4" />
              Download Receipt
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
