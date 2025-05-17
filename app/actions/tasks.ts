"use server"

import { cookies } from "next/headers"
import type { Task, TaskResult, TasksResult } from "@/app/types"
import { USERS, SESSIONS } from "@/app/lib/store"

// Helper to get the current user ID from the session
async function getCurrentUserId(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value
    if (!sessionId || !SESSIONS.has(sessionId)) {
      return null
    }

    const session = SESSIONS.get(sessionId)
    if (!session) {
      return null
    }

    return session.userId
  } catch (error) {
    console.error("Error getting current user ID:", error)
    return null
  }
}

// Helper to get tasks for a user
function getUserTasksFromStore(userId: string): Task[] {
  try {
    return Array.from(TASKS.values()).filter((task) => task.userId === userId)
  } catch (error) {
    console.error("Error getting user tasks from store:", error)
    return []
  }
}

// In-memory task store
const TASKS = new Map<string, Task>()

export async function getUserTasks(): Promise<TasksResult> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: "Not authenticated" }
    }

    const tasks = getUserTasksFromStore(userId)
    return { success: true, data: tasks }
  } catch (error) {
    console.error("Error getting user tasks:", error)
    return { success: false, error: "Failed to get tasks. Please try again." }
  }
}

export async function createTask({ title }: { title: string }): Promise<TaskResult> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: "Not authenticated. Please log in again." }
    }

    if (!title.trim()) {
      return { success: false, error: "Task title cannot be empty" }
    }

    const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2)}`
    const task: Task = {
      id: taskId,
      userId,
      title: title.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    }

    // Add a small delay to prevent race conditions
    await new Promise(resolve => setTimeout(resolve, 100))

    TASKS.set(taskId, task)
    return { success: true, task }
  } catch (error) {
    console.error("Error creating task:", error)
    return { 
      success: false, 
      error: "Failed to create task. Please try again." 
    }
  }
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<TaskResult> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: "Not authenticated. Please log in again." }
    }

    const task = TASKS.get(taskId)
    if (!task) {
      return { success: false, error: "Task not found" }
    }

    if (task.userId !== userId) {
      return { success: false, error: "Not authorized to update this task" }
    }

    const updatedTask = { 
      ...task, 
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    // Add a small delay to prevent race conditions
    await new Promise(resolve => setTimeout(resolve, 100))
    
    TASKS.set(taskId, updatedTask)
    return { success: true, task: updatedTask }
  } catch (error) {
    console.error("Error updating task:", error)
    return { success: false, error: "Failed to update task. Please try again." }
  }
}

export async function deleteTask(taskId: string): Promise<TaskResult> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) {
      return { success: false, error: "Not authenticated. Please log in again." }
    }

    const task = TASKS.get(taskId)
    if (!task) {
      return { success: false, error: "Task not found" }
    }

    if (task.userId !== userId) {
      return { success: false, error: "Not authorized to delete this task" }
    }

    // Add a small delay to prevent race conditions
    await new Promise(resolve => setTimeout(resolve, 100))
    
    TASKS.delete(taskId)
    return { success: true, task }
  } catch (error) {
    console.error("Error deleting task:", error)
    return { success: false, error: "Failed to delete task. Please try again." }
  }
}
