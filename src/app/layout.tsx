import '../app/globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Task Manager App',
  description: 'A simple task management application built with Next.js, Tailwind CSS and Prisma.',
}

/**
 * RootLayout component wraps all pages and provides global styles.
 * The body element uses a light gray background to distinguish the app
 * area from the browser chrome. The min-h-screen class ensures the
 * application always fills at least the viewport height.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}