import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Handle GET requests to /api/tasks to return all tasks ordered by due date.
 */
export async function GET() {
  const tasks = await prisma.task.findMany({
    orderBy: [
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
  const data = await request.json()
  const { title, description, priority, category, dueDate } = data
  const task = await prisma.task.create({
    data: {
      title,
      description: description || null,
      priority: priority || 'MEDIUM',
      category: category || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  })
  return NextResponse.json(task)
}