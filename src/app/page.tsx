import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import DeleteButton from '@/components/DeleteButton'
import TaskList from '@/components/TaskList'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function Home() {
   const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect('/api/auth/signin')
  }
  const faketasks = []
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
       <TaskList initialTasks={faketasks} />
    </main>
  )
}