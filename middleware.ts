import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Allow public routes
  const publicRoutes = [
    "/",
    "/products",
    "/brands",
    "/partners",
    "/investors",
    "/terms",
    "/privacy",
    "/faq",
    "/shipping-returns",
  ]

  // Check if the path starts with any public route
  const isPublicRoute = publicRoutes.some((route) => path === route || path.startsWith(`${route}/`))

  // Allow admin login page
  if (path === "/admin/login") {
    return NextResponse.next()
  }

  // For admin routes, we'll handle auth in the client-side layout
  // since Firebase auth is client-side
  if (path.startsWith("/admin")) {
    return NextResponse.next()
  }

  // Allow all other public routes
  if (isPublicRoute) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
