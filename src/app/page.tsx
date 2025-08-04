import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteButton from '@/components/DeleteButton'
import TaskList from '@/components/TaskList'

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
        <Link
          href="/task/new"
          className="text-sm text-white bg-black py-2 px-4 rounded-2xl font-semibold hover:underline hover:cursor-pointer"
        >
          Add Task
        </Link>
      </header>
      <TaskList initialTasks={tasks} />
    </main>
  )
}