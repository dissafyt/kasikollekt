import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] GET /api/user - Request received")
    
    const authHeader = request.headers.get("Authorization")

    if (!authHeader) {
      // Health check - no auth required
      console.log("[v0] GET /api/user - No auth header, treating as health check")
      
      const response = await fetch(`${API_BASE_URL}/user/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("[v0] GET /api/user - Health check response status:", response.status)

      if (!response.ok) {
        const responseText = await response.text()
        console.log("[v0] GET /api/user - Health check error:", responseText)
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
      console.log("[v0] GET /api/user - Health check successful")
      return NextResponse.json(data)
    }

    // Profile fetch - auth required
    console.log("[v0] GET /api/user - Auth header present, fetching profile")
    console.log("[v0] GET /api/user - Proxying to:", `${API_BASE_URL}/user/`)
    
    const response = await fetch(`${API_BASE_URL}/user/`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] GET /api/user - Backend response status:", response.status)

    if (!response.ok) {
      const responseText = await response.text()
      console.log("[v0] GET /api/user - Backend error:", responseText)
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
    console.log("[v0] GET /api/user - Profile fetched successfully for user:", data?.uid || data?.email)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] GET /api/user - Proxy error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("[v0] PUT /api/user - Request received")
    
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      console.log("[v0] PUT /api/user - No auth header, returning 401")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[v0] PUT /api/user - Request body:", JSON.stringify(body, null, 2))
    console.log("[v0] PUT /api/user - Proxying to:", `${API_BASE_URL}/user/`)

    const response = await fetch(`${API_BASE_URL}/user/`, {
      method: "PUT",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] PUT /api/user - Backend response status:", response.status)

    if (!response.ok) {
      const responseText = await response.text()
      console.log("[v0] PUT /api/user - Backend error:", responseText)
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
    console.log("[v0] PUT /api/user - Profile updated successfully")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] PUT /api/user - Proxy error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
