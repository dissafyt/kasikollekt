import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applicationId = params.id

    // Get auth token from request headers
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Forward request to backend API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"
    const backendUrl = `${apiUrl}/admin/applications/${applicationId}/approve`

    console.log("[v0] Proxying approve request to:", backendUrl)

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }))
      return NextResponse.json({ error: error.detail || `API Error: ${response.status}` }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Error approving application:", error)
    return NextResponse.json({ error: "Failed to approve application" }, { status: 500 })
  }
}
