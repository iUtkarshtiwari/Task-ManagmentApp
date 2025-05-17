"use server"

import { redirect } from "next/navigation"
import type { AuthResult, AuthCheckResult, Session } from "@/app/types"
import { USERS, SESSIONS } from "@/app/lib/store"
import { getCookie, setCookie, deleteCookie } from "@/app/lib/cookies"

export async function signUp({
  name,
  email,
  password,
}: { name: string; email: string; password: string }): Promise<AuthResult> {
  try {
    // Check if user already exists
    if (USERS.has(email)) {
      return { success: false, error: "User with this email already exists" }
    }

    // In a real app, you would hash the password
    const userId = `user_${Date.now()}`
    USERS.set(email, {
      id: userId,
      name,
      email,
      password, // In a real app, this would be hashed
    })

    return { success: true }
  } catch (error) {
    console.error("Signup error:", error)
    return { success: false, error: "Failed to create account" }
  }
}

export async function logIn({ email, password }: { email: string; password: string }): Promise<AuthResult> {
  try {
    // Check if user exists
    const user = USERS.get(email)
    if (!user) {
      return { success: false, error: "No account found with this email" }
    }

    // Check password
    if (user.password !== password) {
      return { success: false, error: "Incorrect password" }
    }

    // Create a session
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`
    const session: Session = {
      userId: user.id,
      email: user.email,
      name: user.name,
      createdAt: new Date().toISOString(),
    }
    
    SESSIONS.set(sessionId, session)

    // Set session cookie
    await setCookie("sessionId", sessionId)

    return { 
      success: true,
      user: {
        name: user.name,
        email: user.email
      }
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An unexpected error occurred during login" }
  }
}

export async function logOut(): Promise<AuthResult> {
  try {
    const sessionId = await getCookie("sessionId")

    if (sessionId) {
      // Delete session
      SESSIONS.delete(sessionId)

      // Clear cookie
      await deleteCookie("sessionId")
    }

    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "Failed to log out" }
  }
}

export async function checkAuth(): Promise<AuthCheckResult> {
  try {
    const sessionId = await getCookie("sessionId")

    if (!sessionId || !SESSIONS.has(sessionId)) {
      return { authenticated: false, user: null }
    }

    const session = SESSIONS.get(sessionId)
    if (!session) {
      return { authenticated: false, user: null }
    }

    const user = Array.from(USERS.values()).find((u) => u.id === session.userId)
    if (!user) {
      return { authenticated: false, user: null }
    }

    return {
      authenticated: true,
      user: {
        name: user.name,
        email: user.email,
      },
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return { authenticated: false, user: null }
  }
}

export async function requireAuth() {
  const { authenticated } = await checkAuth()

  if (!authenticated) {
    redirect("/login")
  }
}
