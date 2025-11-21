import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function PUT(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    const body = await request.json()

    console.log("[v0] Updating user:", params.uid, body)

    const response = await fetch(`${API_BASE_URL}/admin/users/${params.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()

    if (!response.ok) {
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

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update user" },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const authHeader = request.headers.get("authorization")

    console.log("[v0] Deleting user:", params.uid)

    const response = await fetch(`${API_BASE_URL}/admin/users/${params.uid}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const responseText = await response.text()

    if (!response.ok) {
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

    const data = responseText ? JSON.parse(responseText) : { success: true }
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete user" },
      { status: 500 },
    )
  }
}
