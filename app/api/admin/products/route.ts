import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    const url = status ? `${API_BASE_URL}/admin/products?status=${status}` : `${API_BASE_URL}/admin/products`

    console.log("[SERVER] Fetching products from:", url)

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
      console.error("[SERVER] Backend API error:", errorMessage)
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    console.log("[SERVER] Products fetched successfully:", data.length, "products")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[SERVER] Proxy error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    console.log("[SERVER] Creating product:", body)

    const response = await fetch(`${API_BASE_URL}/admin/products/`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
      console.error("[SERVER] Backend API error:", errorMessage)
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    console.log("[SERVER] Product created successfully")
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[SERVER] Proxy error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
