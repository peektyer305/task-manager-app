import NextAuth from 'next-auth'

// Session の user に id プロパティを追加する
declare module 'next-auth' {
  interface Session {
    user?: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}