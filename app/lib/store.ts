import type { User } from "@/app/types"

interface Session {
  userId: string
  email: string
  name: string
  createdAt: string
}

// Mock user database - in a real app, this would be a database
export const USERS = new Map<string, User & { password: string }>()

// Mock session store - in a real app, this would be a database or Redis
export const SESSIONS = new Map<string, Session>()

// Initialize with a test user if needed
if (process.env.NODE_ENV === "development") {
  USERS.set("test@example.com", {
    id: "test_user_1",
    name: "Test User",
    email: "test@example.com",
    password: "password123"
  })
} 