import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

interface Params {
  params: { id: string }
}

/**
 * Handle GET requests to /api/tasks/[id] to return a single task by ID.
 */
export async function GET(request: Request, { params }: Params) {
   const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  const id = parseInt(params.id)
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) {
    return new NextResponse('Task not found', { status: 404 })
  }
  return NextResponse.json(task)
}

/**
 * Handle PUT requests to /api/tasks/[id] to update an existing task. The
 * request body should include title, description, priority, category
 * and dueDate. Only provided fields will be updated.
 */
export async function PUT(request: Request, { params }: Params) {
   const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  const id = parseInt(params.id)
  const data = await request.json()
  const { title, description, priority, category, dueDate } = data
  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title,
        description: description ?? undefined,
        priority: priority ?? undefined,
        category: category ?? undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    })
    return NextResponse.json(task)
  } catch (error) {
    return new NextResponse('Task not found', { status: 404 })
  }
}

/**
 * Handle DELETE requests to /api/tasks/[id] to remove a task from the
 * database. Returns a message upon successful deletion.
 */
export async function DELETE(request: Request, { params }: Params) {
   const session = await getServerSession(authOptions)
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
  const id = parseInt(params.id)
  try {
    await prisma.task.delete({ where: { id } })
    return NextResponse.json({ message: 'Task deleted' })
  } catch (error) {
    return new NextResponse('Task not found', { status: 404 })
  }
}