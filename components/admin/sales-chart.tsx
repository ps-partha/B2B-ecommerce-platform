"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SalesData {
  name: string
  sales: number
  revenue: number
}

export function SalesChart() {
  const [data, setData] = useState<SalesData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real application, this would fetch from your API
    // For now, we'll generate mock data
    const mockData: SalesData[] = [
      { name: "Mon", sales: 32, revenue: 4200 },
      { name: "Tue", sales: 45, revenue: 5800 },
      { name: "Wed", sales: 38, revenue: 4900 },
      { name: "Thu", sales: 50, revenue: 6500 },
      { name: "Fri", sales: 63, revenue: 8200 },
      { name: "Sat", sales: 48, revenue: 6100 },
      { name: "Sun", sales: 35, revenue: 4500 },
    ]

    setData(mockData)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div className="h-80 w-full animate-pulse bg-muted rounded-md" />
  }

  return (
    <Tabs defaultValue="sales">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="sales" className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value} orders`, "Sales"]}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
      <TabsContent value="revenue" className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip
              formatter={(value) => [`$${value}`, "Revenue"]}
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                borderColor: "hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
            />
            <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </TabsContent>
    </Tabs>
  )
}
