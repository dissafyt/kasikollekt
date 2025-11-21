import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

    console.log("[v0] Health check proxy - Auth present:", !!authHeader)

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (authHeader) {
      headers["Authorization"] = authHeader
    }

    const response = await fetch(`${backendUrl}/admin/health/`, {
      method: "GET",
      headers,
    })

    const responseText = await response.text()
    console.log("[v0] Backend health response:", responseText)

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      data = { status: "error", message: responseText }
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || data.message || "Health check failed", status: response.status },
        { status: response.status },
      )
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Health check proxy error:", error)
    return NextResponse.json({ error: error.message || "Failed to check health", status: "error" }, { status: 500 })
  }
}
