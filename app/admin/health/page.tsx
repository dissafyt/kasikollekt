"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { apiClient } from "@/lib/api-client"

export default function AdminHealthPage() {
  const [healthData, setHealthData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkHealth = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Checking health status...")
      const data = await apiClient.health.check()
      console.log("[v0] Health data received:", data)
      setHealthData(data)
    } catch (err: any) {
      console.error("[v0] Health check failed:", err)
      setError(err.message || "Failed to check health")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">System Health</h1>
          <p className="text-muted-foreground">Monitor backend connectivity and authentication status</p>
        </div>
        <Button onClick={checkHealth} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Health Check Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      {healthData && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Overall Status
                {healthData.status === "ok" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={healthData.status === "ok" ? "default" : "secondary"}>
                {healthData.status.toUpperCase()}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Firebase Connection
                {healthData.firebase ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={healthData.firebase ? "default" : "destructive"}>
                {healthData.firebase ? "Connected" : "Disconnected"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                Authentication
                {healthData.authenticated ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge variant={healthData.authenticated ? "default" : "secondary"}>
                {healthData.authenticated ? "Authenticated" : "Not Authenticated"}
              </Badge>
              {healthData.user && (
                <p className="mt-2 text-xs text-muted-foreground">User: {healthData.user}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {loading && !healthData && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
