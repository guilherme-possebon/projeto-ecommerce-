import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../../lib/mongodb'

const adminEmails = [
  'gpossebon67@gmail.com',
  'guilhermepossebon06@gmail.com',
  'schneider.gab0507@gmail.com',
  'pedrohenlucca01@gmail.com',
  'lucaspiassetta@gmail.com'
]

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
  ],
  callbacks: {
    session: ({ session }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session
      } else {
        return false
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)

export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions)
  if (!adminEmails.includes(session?.user?.email)) {
    res.status(401)
    res.end()
    throw new Error(`Usuario sem permição`)
  }
}
