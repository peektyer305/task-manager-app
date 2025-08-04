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
              onClick={() => signOut({callbackUrl:"/"})}
               className="text-sm text-white bg-black py-2 px-4 rounded-2xl font-semibold hover:underline hover:cursor-pointer"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn('github', {callbackUrl:"/"})}
            className="text-sm text-white bg-black py-2 px-4 rounded-2xl font-semibold hover:underline hover:cursor-pointer"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  )
}
