import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteButton from '@/components/DeleteButton'

/**
 * The home page is a server component that fetches all tasks from the
 * database at request time using Prisma. It renders a table of tasks
 * along with actions to edit or delete each task. A link to create
 * a new task is provided above the table.
 */
export default async function Home() {
  // Fetch tasks ordered by due date ascending; tasks without a due date come last
  const tasks = await prisma.task.findMany({
    orderBy: [
      { dueDate: 'asc' },
      { createdAt: 'desc' },
    ],
  })

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <Link
          href="/task/new"
          className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          Add Task
        </Link>
      </header>
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Title</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Category</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Priority</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Due</th>
              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="font-medium">{task.title}</span>
                  {task.description && (
                    <p className="text-xs text-gray-500 mt-1">{task.description}</p>
                  )}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">{task.category || '-'}</td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {task.priority.charAt(0) + task.priority.slice(1).toLowerCase()}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-right space-x-2">
                  <Link
                    href={`/task/${task.id}/edit`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton id={task.id} />
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No tasks found. Click “Add Task” to create your first task.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}