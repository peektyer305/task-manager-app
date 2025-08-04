"use client"

import { redirect, useRouter } from 'next/navigation'

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
       className="text-sm text-red-500  py-2 px-4 rounded-2xl border-red-600 border-solid font-semibold hover:underline hover:cursor-pointer"
    >
      Delete
    </button>
  )
}