import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get("authorization")

    console.log("[v0] Proxying update role request to backend API")

    const response = await fetch(`https://kasikollekt-api-947374471143.europe-west1.run.app/admin/roles/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Backend API error:", errorText)
      return NextResponse.json({ error: errorText || "Failed to update role" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ error: "Failed to update role" }, { status: 500 })
  }
}
