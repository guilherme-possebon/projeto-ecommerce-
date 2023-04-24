import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'
import Nav from '@/Components/Nav'
import { ReactNode } from 'react'

type LayoutProp = {
    children: ReactNode
}

export default function Layout({children}: LayoutProp ) {
  const { data: session } = useSession()
  if (!session) {
    return (
      <>
        <div className="bg-blue-900 w-screen h-screen flex items-center">
          <div className="text-center w-full">
            <button
              className="bg-white p-2 px-4 rounded-lg"
              onClick={() => signIn('google')}
            >
              Login with google
            </button>
          </div>
        </div>
      </>
    )
  }
  return (
    <>
      <Head>
        <title>Nome da empresa</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="bg-blue-900 min-h-screen flex">
        <Nav />
        <div className="bg-white flex-grow m-2 rounded-lg p-4">{children}</div>
      </div>
    </>
  )
}
