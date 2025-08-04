import NextAuth, { type NextAuthOptions } from 'next-auth'
import { authOptions } from '@/lib/auth'

// NextAuth() にオプションを渡したハンドラを GET/POST としてエクスポート
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
