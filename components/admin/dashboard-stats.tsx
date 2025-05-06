import { Users, Package, ShoppingCart, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DashboardStatsProps {
  period: "day" | "week" | "month" | "year" | "all"
}

async function fetchStats(period: string) {
  // In a real application, this would fetch from your API
  // For now, we'll return mock data
  return {
    users: {
      total: 12458,
      new: 124,
      change: 8.2,
      sellers: 3245,
      verifiedSellers: 2876,
    },
    listings: {
      total: 28976,
      new: 342,
      change: 12.5,
      active: 18432,
      sold: 10544,
    },
    orders: {
      total: 8765,
      new: 87,
      change: -3.2,
      completed: 7654,
      pending: 987,
      cancelled: 124,
    },
    revenue: {
      total: 1245800,
      platformFees: 124580,
      transactionFees: 62290,
      change: 15.7,
    },
  }
}

export async function DashboardStats({ period }: DashboardStatsProps) {
  const stats = await fetchStats(period)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num > 0 ? "+" : ""}${num.toFixed(1)}%`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.users.total)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="flex items-center">
              {stats.users.change > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stats.users.change > 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(stats.users.change)}
              </span>
            </span>
            <span className="ml-2">vs. previous {period}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground">New Users</span>
              <span className="font-medium">{formatNumber(stats.users.new)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Sellers</span>
              <span className="font-medium">{formatNumber(stats.users.sellers)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.listings.total)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="flex items-center">
              {stats.listings.change > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stats.listings.change > 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(stats.listings.change)}
              </span>
            </span>
            <span className="ml-2">vs. previous {period}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Active</span>
              <span className="font-medium">{formatNumber(stats.listings.active)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Sold</span>
              <span className="font-medium">{formatNumber(stats.listings.sold)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(stats.orders.total)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="flex items-center">
              {stats.orders.change > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stats.orders.change > 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(stats.orders.change)}
              </span>
            </span>
            <span className="ml-2">vs. previous {period}</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Completed</span>
              <span className="font-medium">{formatNumber(stats.orders.completed)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Pending</span>
              <span className="font-medium">{formatNumber(stats.orders.pending)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.revenue.total)}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span className="flex items-center">
              {stats.revenue.change > 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={stats.revenue.change > 0 ? "text-green-500" : "text-red-500"}>
                {formatPercentage(stats.revenue.change)}
              </span>
            </span>
            <span className="ml-2">vs. previous {period}</span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Platform Fees</span>
              <span className="font-medium">{formatCurrency(stats.revenue.platformFees)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Transaction Fees</span>
              <span className="font-medium">{formatCurrency(stats.revenue.transactionFees)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
