import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/', '/api-docs']

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value
  const isAuthRoute = request.nextUrl.pathname.startsWith("/api/auth")
  const isApiRoute = request.nextUrl.pathname.startsWith("/api")
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route)

  // Allow access to public routes
  if (isPublicRoute) {
    // If user is already logged in and tries to access login/signup, redirect to dashboard
    if (sessionId && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // For API routes that require authentication (except auth routes)
  if (isApiRoute && !isAuthRoute && !sessionId) {
    return NextResponse.json(
      { success: false, error: "Unauthorized - Please log in" },
      { status: 401 }
    )
  }

  // For protected pages
  if (!isPublicRoute && !sessionId) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("from", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
