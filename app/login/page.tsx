"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { logIn, checkAuth } from "@/app/actions/auth"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
})

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check if user is already logged in
    async function checkAuthentication() {
      const { authenticated } = await checkAuth()
      if (authenticated) {
        router.push("/dashboard")
      }
    }
    checkAuthentication()
  }, [router])

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccessMessage("Account created successfully! Please log in.")
    }
  }, [searchParams])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})
    setServerError(null)
    setSuccessMessage(null)

    const formData = new FormData(event.currentTarget)
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    try {
      // Validate form data
      loginSchema.parse(data)

      // Submit form data
      const result = await logIn(data)

      if (result.success) {
        // Show success message briefly before redirecting
        setSuccessMessage("Login successful! Redirecting...")
        // Use replace instead of push to prevent back button from returning to login
        router.replace("/dashboard")
      } else {
        setServerError(result.error || "Invalid email or password")
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(fieldErrors)
      } else {
        setServerError("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex flex-1 items-center justify-center py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </div>

          {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
            </Alert>
          )}

          {serverError && (
            <Alert variant="destructive">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-sm underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="text-center text-sm">
            Don't have an account?{" "}
            <Link href="/signup" className="font-medium underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
