import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get("role")
    const url = role ? `${API_BASE_URL}/admin/users/?role=${role}` : `${API_BASE_URL}/admin/users/`

    console.log("[v0] Fetching users from:", url)

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      const responseText = await response.text()
      let errorMessage = "Unknown error"
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData)
      } catch {
        errorMessage = responseText || `HTTP ${response.status}`
      }
      console.error("[v0] Backend API error:", errorMessage)
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    console.log("[v0] Users fetched successfully:", data.length, "users")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Proxy error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get("authorization")

    console.log("[v0] Proxying create user request to backend API")
    console.log("[v0] Request body:", JSON.stringify(body, null, 2))

    const response = await fetch(`${API_BASE_URL}/admin/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] Backend response status:", response.status, response.statusText)

    const responseText = await response.text()
    console.log("[v0] Backend response body:", responseText)

    if (!response.ok) {
      let errorMessage = "Failed to create user"
      if (responseText) {
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.detail || errorData.message || JSON.stringify(errorData)
          console.error("[v0] Backend API error (JSON):", errorMessage)
        } catch {
          errorMessage = responseText
          console.error("[v0] Backend API error (text):", responseText)
        }
      } else {
        errorMessage = `Backend returned ${response.status} ${response.statusText} with no error details`
        console.error("[v0] Backend API error: Empty response body")
      }
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = JSON.parse(responseText)
    console.log("[v0] User created successfully:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json(
      { error: `Proxy error: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 },
    )
  }
}
