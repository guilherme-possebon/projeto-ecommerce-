import Layout from '@/Components/Layout'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <Layout>
      <div className="text-blue-900 flex">
        <h2>
          Olá, <strong>{session?.user?.name}</strong>
        </h2>
      </div>
    </Layout>
  )
}
