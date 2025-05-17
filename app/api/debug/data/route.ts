import { NextResponse } from "next/server"
import { USERS, SESSIONS } from "@/app/lib/store"
import type { User, Session } from "@/app/types"

interface DebugResponse {
  users: Array<User & { email: string; password: string }>
  sessions: Array<Session & { id: string }>
  userCount: number
  sessionCount: number
}

export async function GET() {
  // Convert Maps to arrays for easier viewing
  const users = Array.from(USERS.entries()).map(([email, user]) => ({
    ...user,
    email,
    password: "********" // Hide actual passwords
  }))

  const sessions = Array.from(SESSIONS.entries()).map(([id, session]) => ({
    ...session,
    id
  }))

  const response: DebugResponse = {
    users,
    sessions,
    userCount: users.length,
    sessionCount: sessions.length
  }

  return NextResponse.json(response)
} 