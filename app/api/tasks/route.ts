import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { cookies } from "next/headers"

// Mock task database - in a real app, this would be a database
const TASKS = new Map()

// Mock session store - in a real app, this would be a database or Redis
const SESSIONS = new Map()

// Helper to get the current user ID from the session
function getCurrentUserId(req: NextRequest): string | null {
  const sessionId = cookies().get("sessionId")?.value
  if (!sessionId || !SESSIONS.has(sessionId)) {
    return null
  }

  return SESSIONS.get(sessionId).userId
}

// Get all tasks for the current user
export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get tasks for this user
    const userTasks = Array.from(TASKS.values())
      .filter((task: any) => task.userId === userId)
      .map(({ userId, ...task }: any) => task) // Remove userId from response

    return NextResponse.json({ success: true, data: userTasks }, { status: 200 })
  } catch (error) {
    console.error("API get tasks error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// Create a new task
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
})

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()

    // Validate request body
    const result = createTaskSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: result.error.flatten() },
        { status: 400 },
      )
    }

    const { title } = result.data

    const taskId = `task_${Date.now()}`
    const newTask = {
      id: taskId,
      title,
      completed: false,
      createdAt: new Date().toISOString(),
      userId, // Store which user this task belongs to
    }

    TASKS.set(taskId, newTask)

    // Return task without the userId field
    const { userId: _, ...taskWithoutUserId } = newTask

    return NextResponse.json({ success: true, task: taskWithoutUserId }, { status: 201 })
  } catch (error) {
    console.error("API create task error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
