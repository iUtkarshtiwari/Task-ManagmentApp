"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, LogOut, RefreshCw } from "lucide-react"
import { getUserTasks, createTask, deleteTask, updateTask } from "@/app/actions/tasks"
import { checkAuth, logOut } from "@/app/actions/auth"
import type { Task } from "@/app/types"

export default function DashboardPage() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingTask, setIsCreatingTask] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<{ name: string; email: string } | null>(null)

  async function loadTasks() {
    try {
      const tasksResult = await getUserTasks()
      if (tasksResult.success) {
        setTasks(tasksResult.data || [])
        setError(null)
      } else {
        setError(tasksResult.error || "Failed to load tasks")
      }
    } catch (err) {
      setError("An error occurred while loading tasks")
    }
  }

  useEffect(() => {
    async function initialize() {
      try {
        // Check if user is authenticated
        const authResult = await checkAuth()
        if (!authResult.authenticated) {
          router.push("/login")
          return
        }

        setUser(authResult.user)
        await loadTasks()
      } catch (err) {
        setError("An error occurred while loading the dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    initialize()
  }, [router])

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault()
    if (!newTaskTitle.trim() || isCreatingTask) return

    setIsCreatingTask(true)
    setError(null)

    try {
      const result = await createTask({ title: newTaskTitle.trim() })
      if (result.success && result.task) {
        setTasks([...tasks, result.task])
        setNewTaskTitle("")
      } else {
        setError(result.error || "Failed to create task")
      }
    } catch (err) {
      setError("An error occurred while creating the task")
    } finally {
      setIsCreatingTask(false)
    }
  }

  async function handleDeleteTask(taskId: string) {
    try {
      const result = await deleteTask(taskId)
      if (result.success) {
        setTasks(tasks.filter((task) => task.id !== taskId))
      } else {
        setError(result.error || "Failed to delete task")
      }
    } catch (err) {
      setError("An error occurred while deleting the task")
    }
  }

  async function handleToggleComplete(taskId: string, completed: boolean) {
    try {
      const result = await updateTask(taskId, { completed })
      if (result.success) {
        setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed } : task)))
      } else {
        setError(result.error || "Failed to update task")
      }
    } catch (err) {
      setError("An error occurred while updating the task")
    }
  }

  async function handleLogout() {
    try {
      await logOut()
      router.push("/login")
    } catch (err) {
      setError("Failed to log out")
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl">TaskTracker</div>
          <div className="flex items-center gap-4">
            {user && <span className="text-sm text-gray-500">Welcome, {user.name}</span>}
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">My Tasks</h1>
            <Button variant="outline" size="sm" onClick={loadTasks} className="gap-2">
              <RefreshCw size={16} /> Refresh
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={loadTasks} className="gap-2">
                  <RefreshCw size={16} /> Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Task</CardTitle>
              <CardDescription>Create a new task to track</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateTask}>
              <CardContent>
                <div className="flex items-end gap-4">
                  <div className="flex-1">
                    <Label htmlFor="new-task">Task Title</Label>
                    <Input
                      id="new-task"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      placeholder="Enter task title"
                      required
                      disabled={isCreatingTask}
                    />
                  </div>
                  <Button type="submit" className="gap-2" disabled={isCreatingTask}>
                    <Plus size={16} /> {isCreatingTask ? "Adding..." : "Add Task"}
                  </Button>
                </div>
              </CardContent>
            </form>
          </Card>

          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-center text-gray-500">No tasks yet. Create one above!</p>
            ) : (
              tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="flex items-center gap-4 p-4">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => handleToggleComplete(task.id, checked as boolean)}
                    />
                    <div className="flex-1">
                      <p className={task.completed ? "line-through text-gray-500" : ""}>{task.title}</p>
                      <p className="text-sm text-gray-500">
                        Created {new Date(task.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex justify-center text-sm text-gray-500">
          TaskTracker - Built for Testing Purposes
        </div>
      </footer>
    </div>
  )
}
