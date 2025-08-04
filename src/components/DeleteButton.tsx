"use client"

import { useRouter } from 'next/navigation'

/**
 * DeleteButton is a client component that deletes a task by its ID
 * via the DELETE API route. After deletion it refreshes the page to
 * re-fetch the updated task list. A red styled link makes the intent
 * clear to the user.
 */
export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter()
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    // Refresh the current route to show updated tasks
    router.refresh()
  }
  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline"
    >
      Delete
    </button>
  )
}