import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
        },
        { status: 401 }
      )
    }

    // In production, you'd verify the token with Firebase Admin
    return NextResponse.json({
      authenticated: true,
      user: {
        token: sessionCookie.value,
      },
    })
  } catch (error) {
    console.error("User status error:", error)
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
      },
      { status: 500 }
    )
  }
}
