import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const backendUrl = `${API_BASE_URL}/admin/applications/brand`
    console.log("[v0] Proxying brand application to:", backendUrl)

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error in brand application:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
