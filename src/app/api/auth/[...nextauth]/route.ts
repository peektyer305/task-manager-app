import NextAuth, { type NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'

// NextAuth のオプションを型定義に従って記述
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  // session.strategy を明示的にリテラルで指定（省略すると 'jwt' がデフォルト）
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token, user }) {
      // セッションにユーザーIDを追加する例
      if (session.user) {
        session.user.id = user?.id ?? (token.sub as string | undefined)
      }
      return session
    },
  },
}

// NextAuth() にオプションを渡したハンドラを GET/POST としてエクスポート
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
