import type { Context } from "./ctx.ts";

export function issues_view_new(ctx: Context, error?: string): string {
  return (
    <div data-file="issues_view_new">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Issue</h1>
      {error && (
        <div data-role="error" className="bg-red-50 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form method="POST" action="/issues" className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            required
            placeholder="Issue title"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="body"
            rows="6"
            placeholder="Describe the issue..."
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
          ></textarea>
        </div>
        <button
          type="submit"
          data-action="create"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
        >
          Submit new issue
        </button>
      </form>
    </div>
  );
}
