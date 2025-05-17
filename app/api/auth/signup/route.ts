import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

// Mock user database - in a real app, this would be a database
const USERS = new Map()

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = signupSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: result.error.flatten() },
        { status: 400 },
      )
    }

    const { name, email, password } = result.data

    // Check if user already exists
    if (USERS.has(email)) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 409 })
    }

    // In a real app, you would hash the password
    const userId = `user_${Date.now()}`
    USERS.set(email, {
      id: userId,
      name,
      email,
      password, // In a real app, this would be hashed
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ success: true, message: "User created successfully" }, { status: 201 })
  } catch (error) {
    console.error("API signup error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
