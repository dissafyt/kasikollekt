"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from 'next/navigation'
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { ShieldAlert } from 'lucide-react'
import { auth } from "@/lib/firebase-config"

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, userRole } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (!user && pathname !== "/admin/login") {
        console.log("[v0] Not authenticated, redirecting to login")
        router.push("/admin/login")
      }

      if (user && pathname === "/admin/login") {
        console.log("[v0] Already authenticated, redirecting to dashboard")
        router.push("/admin")
      }
    }
  }, [user, loading, pathname, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (user && userRole !== "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to access the admin dashboard. Only users with admin role can access this area.
            </AlertDescription>
          </Alert>
          <div className="mt-4 flex gap-2">
            <Button
              onClick={async () => {
                if (auth) {
                  await auth.signOut()
                }
                router.push("/admin/login")
              }}
              variant="outline"
              className="flex-1"
            >
              Sign Out
            </Button>
            <Button onClick={() => router.push("/")} className="flex-1">
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </AuthProvider>
  )
}
