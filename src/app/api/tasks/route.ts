import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth"
/**
 * Handle GET requests to /api/tasks to return all tasks ordered by due date.
 */
export async function GET() {
   const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const tasks = await prisma.task.findMany({
     where: { userId: session.user.id },
    orderBy: [
    { order: 'asc' },
      { dueDate: 'asc' },
      { createdAt: 'desc' },
    ],
  })
  return NextResponse.json(tasks)
}

/**
 * Handle POST requests to /api/tasks to create a new task. The
 * request body should be JSON with title, description, priority,
 * category and dueDate fields. The dueDate should be parseable
 * by the JavaScript Date constructor.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const data = await request.json()
  const { title, description, priority, category, dueDate } = data
  const task = await prisma.task.create({
    data: {
      title,
      description: description || null,
      priority: priority as any,
      category: category || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      user: { connect: { id: session.user.id } },
    },
  })
  return NextResponse.json(task)
}