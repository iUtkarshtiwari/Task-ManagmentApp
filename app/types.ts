export interface Task {
  id: string
  userId: string
  title: string
  completed: boolean
  createdAt: string
  updatedAt?: string
}

export interface User {
  id: string
  name: string
  email: string
  password: string
}

export interface AuthResult {
  success: boolean
  error?: string
  user?: {
    name: string
    email: string
  }
}

export interface TaskResult {
  success: boolean
  error?: string
  task?: Task
}

export interface TasksResult {
  success: boolean
  error?: string
  data?: Task[]
}

export interface AuthCheckResult {
  authenticated: boolean
  user: {
    name: string
    email: string
  } | null
}

export interface Session {
  userId: string
  email: string
  name: string
  createdAt: string
}
