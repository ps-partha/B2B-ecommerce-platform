import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  type: "user_registered" | "listing_created" | "order_completed" | "seller_verified" | "report_submitted"
  user: {
    id: string
    name: string
    image?: string
  }
  description: string
  timestamp: Date
}

async function fetchRecentActivity() {
  // In a real application, this would fetch from your API
  // For now, we'll return mock data
  const now = new Date()

  const activities: Activity[] = [
    {
      id: "1",
      type: "user_registered",
      user: {
        id: "u1",
        name: "John Doe",
        image: "/placeholder.svg?height=40&width=40",
      },
      description: "registered a new account",
      timestamp: new Date(now.getTime() - 25 * 60 * 1000), // 25 minutes ago
    },
    {
      id: "2",
      type: "listing_created",
      user: {
        id: "u2",
        name: "Jane Smith",
        image: "/placeholder.svg?height=40&width=40",
      },
      description: "created a new listing: Premium Gaming Account",
      timestamp: new Date(now.getTime() - 1.5 * 60 * 60 * 1000), // 1.5 hours ago
    },
    {
      id: "3",
      type: "order_completed",
      user: {
        id: "u3",
        name: "Mike Johnson",
        image: "/placeholder.svg?height=40&width=40",
      },
      description: "completed an order for $120",
      timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: "4",
      type: "seller_verified",
      user: {
        id: "u4",
        name: "Sarah Williams",
        image: "/placeholder.svg?height=40&width=40",
      },
      description: "was verified as a seller",
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    {
      id: "5",
      type: "report_submitted",
      user: {
        id: "u5",
        name: "Alex Brown",
        image: "/placeholder.svg?height=40&width=40",
      },
      description: "reported a listing for policy violation",
      timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000), // 8 hours ago
    },
  ]

  return activities
}

export async function RecentActivity() {
  const activities = await fetchRecentActivity()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <div className="space-y-5">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar>
            <AvatarImage src={activity.user.image || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span> {activity.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
