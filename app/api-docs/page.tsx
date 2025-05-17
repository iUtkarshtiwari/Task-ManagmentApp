export default function ApiDocsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl">TaskTracker API</div>
          <div>
            <a href="/" className="text-sm underline">
              Back to Home
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 py-12">
        <div className="container max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">API Documentation</h1>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-4">Authentication</h2>
              <div className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex items-center">
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-mono mr-3">POST</span>
                      <span className="font-mono">/api/auth/signup</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Create a new user account</h3>
                    <p className="text-gray-600 mb-4">Register a new user with name, email, and password.</p>

                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2">Request Body</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Response (200 OK)</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "success": true,
  "message": "User created successfully"
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex items-center">
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-mono mr-3">POST</span>
                      <span className="font-mono">/api/auth/login</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Login to existing account</h3>
                    <p className="text-gray-600 mb-4">Authenticate a user and receive a session token.</p>

                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2">Request Body</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "email": "john@example.com",
  "password": "securepassword"
}`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Response (200 OK)</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "success": true,
  "token": "jwt-token-here"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Tasks</h2>
              <div className="space-y-6">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex items-center">
                      <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-mono mr-3">GET</span>
                      <span className="font-mono">/api/tasks</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Get all tasks</h3>
                    <p className="text-gray-600 mb-4">Retrieve all tasks for the authenticated user.</p>

                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2">Headers</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">{`Authorization: Bearer {token}`}</pre>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Response (200 OK)</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "success": true,
  "data": [
    {
      "id": "task-123",
      "title": "Complete project",
      "completed": false,
      "createdAt": "2023-05-17T13:58:00Z"
    },
    {
      "id": "task-456",
      "title": "Write tests",
      "completed": true,
      "createdAt": "2023-05-16T10:30:00Z"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex items-center">
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-mono mr-3">POST</span>
                      <span className="font-mono">/api/tasks</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Create a new task</h3>
                    <p className="text-gray-600 mb-4">Create a new task for the authenticated user.</p>

                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2">Headers</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">{`Authorization: Bearer {token}`}</pre>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2">Request Body</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "title": "New task title"
}`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Response (201 Created)</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "success": true,
  "task": {
    "id": "task-789",
    "title": "New task title",
    "completed": false,
    "createdAt": "2023-05-17T13:58:00Z"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex items-center">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-mono mr-3">PUT</span>
                      <span className="font-mono">/api/tasks/{"{taskId}"}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Update a task</h3>
                    <p className="text-gray-600 mb-4">Update an existing task's properties.</p>

                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2">Headers</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">{`Authorization: Bearer {token}`}</pre>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2">Request Body</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "title": "Updated task title",
  "completed": true
}`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Response (200 OK)</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "success": true,
  "task": {
    "id": "task-123",
    "title": "Updated task title",
    "completed": true,
    "createdAt": "2023-05-17T13:58:00Z",
    "updatedAt": "2023-05-17T14:30:00Z"
  }
}`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex items-center">
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-mono mr-3">DELETE</span>
                      <span className="font-mono">/api/tasks/{"{taskId}"}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">Delete a task</h3>
                    <p className="text-gray-600 mb-4">Remove a task from the user's task list.</p>

                    <div className="mb-4">
                      <h4 className="font-bold text-sm mb-2">Headers</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">{`Authorization: Bearer {token}`}</pre>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm mb-2">Response (200 OK)</h4>
                      <pre className="bg-gray-100 p-3 rounded font-mono text-sm">
                        {`{
  "success": true,
  "message": "Task deleted successfully"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container flex justify-center text-sm text-gray-500">
          TaskTracker API - Built for Testing Purposes
        </div>
      </footer>
    </div>
  )
}
