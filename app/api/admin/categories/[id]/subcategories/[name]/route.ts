import { type NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kasikollekt-api-947374471143.europe-west1.run.app"

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string; name: string }> }) {
  try {
    const authHeader = request.headers.get("authorization")
    const { id: categoryId, name: subcatName } = await params

    console.log("[v0] Removing subcategory:", subcatName, "from category:", categoryId)

    // Forward to backend API
    const response = await fetch(
      `${API_BASE_URL}/admin/categories/${categoryId}/subcategories/${encodeURIComponent(subcatName)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(authHeader && { Authorization: authHeader }),
        },
      },
    )

    if (!response.ok) {
      const responseText = await response.text()
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

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("[v0] Proxy error:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}
