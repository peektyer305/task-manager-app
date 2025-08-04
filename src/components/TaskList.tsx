// src/components/TaskList.tsx
'use client'

import { useState, useEffect } from 'react'
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

export default function TaskList() {
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初回マウント時にタスクを取得
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks')
        if (!res.ok) throw new Error(`Fetch failed: ${res.status}`)
        const data: Task[] = await res.json()
        setTasks(data)
      } catch (e: any) {
        console.error(e)
        setError(e.message || 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // ドラッグ＆ドロップ用センサー
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEnd = async (event: any) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = tasks.findIndex((t) => t.id === active.id)
    const newIndex = tasks.findIndex((t) => t.id === over.id)
    const newTasks = arrayMove(tasks, oldIndex, newIndex)
    setTasks(newTasks)

    try {
      await fetch('/api/tasks/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: newTasks.map((t) => t.id) }),
      })
    } catch (err) {
      console.error(err)
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading tasks...</div>
  }
  if (error) {
    return (
      <div className="p-4 text-red-600 text-center">
        Failed to load tasks: {error}
      </div>
    )
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
                <SortableRow
                  key={task.id}
                  task={task}
                  onDelete={() =>
                    setTasks((prev) => prev.filter((t) => t.id !== task.id))
                  }
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  )
}

// 並び替え可能な行コンポーネント
function SortableRow({
  task,
  onDelete,
}: {
  task: Task
  onDelete: () => void
}) {
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
          className="text-sm text-white bg-black py-2 px-4 rounded-2xl font-semibold"
        >
          Edit
        </Link>
        <DeleteButton id={task.id} onDelete={onDelete} />
      </td>
    </tr>
  )
}
