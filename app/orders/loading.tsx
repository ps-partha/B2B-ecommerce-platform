import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function OrdersLoading() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <CardTitle>My Orders</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-[200px]" />
            </div>
          </div>
        </CardHeader>

        <div className="px-4 mb-4">
          <Skeleton className="h-10 w-full mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-[180px]" />
            <Skeleton className="h-8 w-[180px]" />
          </div>
        </div>

        <CardContent>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="flex items-center gap-4 rounded-lg border p-4 mb-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                  <div className="flex gap-2 mt-2">
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <div className="text-center">
                  <Skeleton className="h-5 w-16 mx-auto" />
                  <Skeleton className="h-3 w-24 mx-auto mt-2" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
