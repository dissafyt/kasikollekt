import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId
    const authHeader = request.headers.get("authorization")

    console.log(`[SERVER] Fetching products for user:`, userId)

    const response = await fetch(`${API_BASE_URL}/admin/products/by-user/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
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

      console.error(`[SERVER] Backend API error (${response.status}):`, errorMessage)
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    console.log("[SERVER] Products fetched successfully:", data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[SERVER] Proxy error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
