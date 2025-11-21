import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("authorization")
    const body = await request.json()
    const { id: categoryId } = await params

    console.log("[v0] Updating category:", categoryId, "with data:", body)

    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify(body),
    })

    const responseText = await response.text()
    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      data = { error: responseText }
    }

    if (!response.ok) {
      console.error("[v0] Backend API error:", data)
      return NextResponse.json({ error: data.detail || "Failed to update category" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const authHeader = request.headers.get("authorization")
    const { id: categoryId } = await params

    console.log("[v0] Deleting category:", categoryId)

    const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(authHeader && { Authorization: authHeader }),
      },
    })

    const responseText = await response.text()
    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      data = { error: responseText }
    }

    if (!response.ok) {
      console.error("[v0] Backend API error:", data)
      return NextResponse.json({ error: data.detail || "Failed to delete category" }, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
