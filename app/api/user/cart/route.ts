import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] GET /api/user/cart - Request received")
    
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      console.log("[v0] GET /api/user/cart - No auth header, returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const backendUrl = `${API_BASE_URL}/user/cart/`
    console.log("[v0] GET /api/user/cart - Proxying to:", backendUrl)
    console.log("[v0] GET /api/user/cart - Auth header present:", authHeader.substring(0, 20) + "...")

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] GET /api/user/cart - Backend response status:", response.status, response.statusText)

    if (!response.ok) {
      const responseText = await response.text()
      console.log("[v0] GET /api/user/cart - Backend error response:", responseText)
      let errorMessage = "Unknown error"
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData)
      } catch {
        errorMessage = responseText || `HTTP ${response.status}`
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] GET /api/user/cart - Success, cart items:", data?.items?.length || 0)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] GET /api/user/cart - Proxy error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
