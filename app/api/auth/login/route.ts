import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { cookies } from "next/headers"

// Mock user database - in a real app, this would be a database
const USERS = new Map()

// Mock session store - in a real app, this would be a database or Redis
const SESSIONS = new Map()

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: result.error.flatten() },
        { status: 400 },
      )
    }

    const { email, password } = result.data

    // Check if user exists
    const user = USERS.get(email)
    if (!user || user.password !== password) {
      return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 })
    }

    // Create a session
    const sessionId = `session_${Date.now()}`
    const token = `mock-jwt-token-${sessionId}` // In a real app, this would be a JWT

    SESSIONS.set(sessionId, {
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
    })

    // Set session cookie
    cookies().set("sessionId", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })

    return NextResponse.json({ success: true, token }, { status: 200 })
  } catch (error) {
    console.error("API login error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
