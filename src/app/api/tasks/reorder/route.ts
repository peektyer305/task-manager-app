import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  // フロントエンドから送られてくる新しい順序
  const { ids } = await request.json() as { ids: number[] }

  // トランザクションで順序を一括更新
  await prisma.$transaction(
    ids.map((id, index) =>
      prisma.task.update({
        where: { id },
        data: { order: index },
      })
    )
  )

  return NextResponse.json({ message: 'Order updated' })
}
