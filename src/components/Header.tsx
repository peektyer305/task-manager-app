// src/components/Header.tsx
'use client'

import Link from 'next/link'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-xl font-bold">
          Task Manager
        </Link>
        {status === 'loading' ? (
          <span>Loading...</span>
        ) : session?.user ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {session.user.name ?? session.user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="text-sm text-red-600 hover:underline"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-sm text-blue-600 hover:underline"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
