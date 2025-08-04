import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

/** GET: 指定IDのタスクを取得 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)
  const task = await prisma.task.findUnique({ where: { id } })
  if (!task) {
    return new NextResponse('Task not found', { status: 404 })
  }
  return NextResponse.json(task)
}

/** PUT: 指定IDのタスクを更新 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)
  const { title, description, priority, category, dueDate } = await request.json()

  try {
    const updated = await prisma.task.update({
      where: { id },
      data: {
        title,
        description: description ?? undefined,
        priority: priority ?? undefined,
        category: category ?? undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
      },
    })
    return NextResponse.json(updated)
  } catch (e) {
    return new NextResponse('Task not found', { status: 404 })
  }
}

/** DELETE: 指定IDのタスクを削除 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id, 10)
  try {
    await prisma.task.delete({ where: { id } })
    return new NextResponse('Task deleted', { status: 200 })
  } catch (e) {
    return new NextResponse('Task not found', { status: 404 })
  }
}
