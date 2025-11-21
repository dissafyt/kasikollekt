"use client"

import { useEffect, useState } from "react"
import { Bell, CheckCircle2, AlertCircle, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  type: "application" | "health" | "system"
  title: string
  message: string
  timestamp: Date
  link?: string
}

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchNotifications = async () => {
    try {
      // Fetch pending applications
      const applications = await apiClient.applications.list()
      const pendingApps = applications.filter((app: any) => app.status === "pending")

      // Fetch health status
      const health = await apiClient.health.check()

      const newNotifications: Notification[] = []

      // Add pending applications notifications
      if (pendingApps.length > 0) {
        newNotifications.push({
          id: "pending-apps",
          type: "application",
          title: `${pendingApps.length} Pending Application${pendingApps.length > 1 ? "s" : ""}`,
          message: `You have ${pendingApps.length} application${pendingApps.length > 1 ? "s" : ""} waiting for review`,
          timestamp: new Date(),
          link: "/admin/applications",
        })
      }

      // Add health check errors
      if (!health.firebase) {
        newNotifications.push({
          id: "health-firebase",
          type: "health",
          title: "Firebase Connection Error",
          message: "Firebase is not connected. Please check your configuration.",
          timestamp: new Date(),
        })
      }

      if (!health.authenticated) {
        newNotifications.push({
          id: "health-auth",
          type: "health",
          title: "Authentication Warning",
          message: "User is not authenticated. Some features may not work.",
          timestamp: new Date(),
        })
      }

      setNotifications(newNotifications)
      setLoading(false)
    } catch (err) {
      console.error("[v0] Failed to fetch notifications:", err)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial fetch
    fetchNotifications()

    // Poll every 60 seconds
    const interval = setInterval(fetchNotifications, 60000)

    return () => clearInterval(interval)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "application":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "health":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (notification.link) {
      router.push(notification.link)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
            >
              {notifications.length}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 z-[100]">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {notifications.length}
            </Badge>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {loading ? (
          <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="mx-auto h-8 w-8 mb-2 text-green-500" />
            <p>All caught up!</p>
            <p className="text-xs mt-1">No new notifications</p>
          </div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className="flex items-start gap-3 p-3 cursor-pointer"
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground">{notification.timestamp.toLocaleTimeString()}</p>
                </div>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-center justify-center text-xs text-muted-foreground">
          Auto-refreshes every minute
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
