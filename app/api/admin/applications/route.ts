import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const status = searchParams.get("status")

    const params = new URLSearchParams()
    if (type) params.append("type", type)
    if (status) params.append("status", status)
    const queryString = params.toString()

    const backendUrl = `${API_BASE_URL}/admin/applications/${queryString ? `?${queryString}` : ""}`
    console.log("[v0] Proxying GET request to:", backendUrl)

    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] Backend response status:", response.status)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Request failed" }))
      return NextResponse.json(error, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Error in applications list:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
