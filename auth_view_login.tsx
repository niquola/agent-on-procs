export function auth_view_login(error?: string): string {
  return (
    <div data-page="login">
      <h1 className="text-2xl font-bold mb-6">Login</h1>
      {error && (
        <div data-role="error" className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form method="POST" action="/login" data-form="login" className="space-y-4">
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
          data-action="login"
          className="w-full px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-700 transition duration-200"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
