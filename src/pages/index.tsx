import Layout from '@/Components/Layout'
import { useSession } from 'next-auth/react'
import React from 'react'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import clientPromise from '../../lib/mongodb'

interface ConnectionStatus {
  isConnected: boolean
}

export const getServerSideProps: GetServerSideProps<
  ConnectionStatus
> = async () => {
  try {
    await clientPromise

    return {
      props: { isConnected: true }
    }
  } catch (e) {
    console.error(e)
    return {
      props: { isConnected: false }
    }
  }
}

export default function Home({
  isConnected
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
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
