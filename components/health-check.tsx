"use client"

import { useEffect, useState } from "react"
import { Activity, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { apiClient } from "@/lib/api-client"
import { Badge } from "@/components/ui/badge"

interface HealthStatus {
  status: string
  firebase: boolean
  authenticated: boolean
  user?: string
}

export function HealthCheck() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    try {
      setError(null)
      const data = await apiClient.health.check()
      setHealth(data)
      setLoading(false)
    } catch (err: any) {
      console.error("[v0] Health check failed:", err)
      setError(err.message || "Failed to check health")
      setHealth(null)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Initial check
    checkHealth()

    // Poll every 30 seconds
    const interval = setInterval(checkHealth, 30000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    if (loading) return "text-muted-foreground"
    if (error || !health) return "text-destructive"
    if (health.status === "ok" && health.firebase && health.authenticated) {
      return "text-green-500"
    }
    if (health.status === "ok" && health.firebase) {
      return "text-yellow-500"
    }
    return "text-destructive"
  }

  const getStatusIcon = () => {
    if (loading) return <Activity className="h-5 w-5 animate-pulse" />
    if (error || !health) return <XCircle className="h-5 w-5" />
    if (health.status === "ok" && health.firebase && health.authenticated) {
      return <CheckCircle2 className="h-5 w-5" />
    }
    if (health.status === "ok" && health.firebase) {
      return <AlertCircle className="h-5 w-5" />
    }
    return <XCircle className="h-5 w-5" />
  }

  return (
    <HoverCard openDelay={200}>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className={`relative ${getStatusColor()}`} onClick={checkHealth}>
          {getStatusIcon()}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80 z-[100]" align="end">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">System Health</h4>
            <Badge
              variant={
                health?.status === "ok" && health?.firebase && health?.authenticated
                  ? "default"
                  : health?.status === "ok" && health?.firebase
                    ? "secondary"
                    : "destructive"
              }
            >
              {loading ? "Checking..." : error ? "Error" : health?.status || "Unknown"}
            </Badge>
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-2">
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          {health && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Firebase</span>
                <div className="flex items-center gap-1">
                  {health.firebase ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs">Connected</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-destructive" />
                      <span className="text-xs">Disconnected</span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Authentication</span>
                <div className="flex items-center gap-1">
                  {health.authenticated ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs">Authenticated</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-yellow-500" />
                      <span className="text-xs">Not Authenticated</span>
                    </>
                  )}
                </div>
              </div>

              {health.user && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="text-xs font-mono">{health.user.substring(0, 8)}...</span>
                </div>
              )}
            </div>
          )}

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground">Last checked: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
