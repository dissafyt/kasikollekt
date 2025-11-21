"use client"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/lib/auth-context"
import { HealthCheck } from "./health-check"
import { NotificationsDropdown } from "./notifications-dropdown"

export function AdminHeader() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-10 flex h-16 gap-4 border-b bg-background px-4 lg:px-6 flex-row items-center justify-center">
      {/* Search */}
      <div className="flex flex-1 flex-row justify-end">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <HealthCheck />

        <NotificationsDropdown />

        <div className="flex items-center gap-2 rounded-lg border px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-xs text-primary-foreground">
              {user?.email?.substring(0, 2).toUpperCase() || "AD"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium md:inline-block">{user?.email || "Admin"}</span>
        </div>
      </div>
    </header>
  )
}
