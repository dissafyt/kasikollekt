import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id
    const body = await request.json()
    const authHeader = request.headers.get("authorization")
    const userId = body.user_id

    if (!userId) {
      return NextResponse.json({ error: "user_id is required" }, { status: 400 })
    }

    console.log(`[SERVER] Assigning product ${productId} to user ${userId}`)

    const response = await fetch(`${API_BASE_URL}/admin/products/${productId}/assign?user_id=${userId}`, {
      method: "POST",
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
    console.log("[SERVER] Product assigned successfully:", data)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[SERVER] Proxy error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
