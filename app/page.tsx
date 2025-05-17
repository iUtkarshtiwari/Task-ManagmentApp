import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl">TaskTracker</div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">Manage Your Tasks Efficiently</h1>
            <p className="text-lg text-gray-500 mb-12 max-w-[600px]">
              A simple task management application built for testing various aspects of web development and quality
              assurance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/api-docs">
                <Button size="lg" variant="outline">
                  API Documentation
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="py-20 bg-gray-50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">User Authentication</h3>
                <p className="text-gray-500">Secure signup and login functionality with form validation.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">Task Management</h3>
                <p className="text-gray-500">Create, view, update, and delete tasks with ease.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-3">RESTful API</h3>
                <p className="text-gray-500">Comprehensive API endpoints for integration testing.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex justify-center text-sm text-gray-500">
          TaskTracker - Built for Testing Purposes
        </div>
      </footer>
    </div>
  )
}
