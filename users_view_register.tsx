export function users_view_register(error?: string): string {
  return (
    <div data-file="users_view_register">
      <h1 className="text-2xl font-bold mb-6">Register</h1>
      {error && (
        <div data-role="error" className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form method="POST" action="/register" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          data-action="register"
          className="w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition duration-200"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-500 text-center">
        Already have an account? <a href="/login" className="text-blue-600 hover:underline">Sign in</a>
      </p>
    </div>
  );
}
