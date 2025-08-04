'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import DeleteButton from './DeleteButton'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Task } from '@prisma/client'

type Props = {
  initialTasks: Task[]
}

// 個々の行をドラッグ可能にするためのラッパー
function SortableRow({ task }: { task: Task }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="hover:bg-gray-50 cursor-grab"
    >
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
        >
          <button   className="text-sm text-white bg-black py-2 px-4 rounded-2xl font-semibold hover:underline hover:cursor-pointer">Edit</button>
        </Link>
        <DeleteButton id={task.id} />
      </td>
    </tr>
  )
}

export default function TaskList({ initialTasks }: Props) {
  const router = useRouter()
  // ローカル状態に変換し、並び替えで変更できるようにする
  const [tasks, setTasks] = useState(initialTasks)

  // DnD Kit センサー設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // ドラッグ開始距離を少し大きくして誤操作を減らす
      },
    })
  )

  const handleDragEnd = async (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = tasks.findIndex((t) => t.id === active.id)
    const newIndex = tasks.findIndex((t) => t.id === over.id)

    // フロント側の配列を入れ替え
    const newTasks = arrayMove(tasks, oldIndex, newIndex)
    setTasks(newTasks)

    // サーバーに新しい順序を保存
    try {
      await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newTasks.map((t) => t.id) }),
      })
      // サーバー側の最新状態を取得し直す
      router.refresh()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="overflow-x-auto bg-white shadow rounded">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <tbody className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <SortableRow key={task.id} task={task} />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  )
}
