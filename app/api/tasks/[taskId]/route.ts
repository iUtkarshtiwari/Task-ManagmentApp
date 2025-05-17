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

// Update a task
const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
})

export async function PUT(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.taskId

    // Check if task exists and belongs to user
    const task = TASKS.get(taskId)
    if (!task || task.userId !== userId) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    const body = await request.json()

    // Validate request body
    const result = updateTaskSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Invalid input", details: result.error.flatten() },
        { status: 400 },
      )
    }

    // Update task
    const updatedTask = {
      ...task,
      ...result.data,
      updatedAt: new Date().toISOString(),
    }

    TASKS.set(taskId, updatedTask)

    // Return task without the userId field
    const { userId: _, ...taskWithoutUserId } = updatedTask

    return NextResponse.json({ success: true, task: taskWithoutUserId }, { status: 200 })
  } catch (error) {
    console.error("API update task error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

// Delete a task
export async function DELETE(request: NextRequest, { params }: { params: { taskId: string } }) {
  try {
    const userId = getCurrentUserId(request)
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const taskId = params.taskId

    // Check if task exists and belongs to user
    const task = TASKS.get(taskId)
    if (!task || task.userId !== userId) {
      return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 })
    }

    // Delete task
    TASKS.delete(taskId)

    return NextResponse.json({ success: true, message: "Task deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("API delete task error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
