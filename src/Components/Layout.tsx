import Head from 'next/head'
import { useSession, signIn, signOut } from 'next-auth/react'
import Nav from '@/Components/Nav'
import { ReactNode } from 'react'

type LayoutProp = {
  children: ReactNode
}

export default function Layout({ children }: LayoutProp) {
  const { data: session } = useSession()
  if (!session) {
    return (
      <>
        <div className="bg-bgGray dark:bgDarkMode w-screen h-screen flex items-center">
          <div className="text-center w-full">
            <button
              className="bg-white dark:bgDarkMode p-2 px-4 rounded-lg"
              onClick={() => signIn('google')}
            >
              Logar com google
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

      <div className="min-h-screen flex bg-bgGray dark:bgDarkMode">
        <Nav />
        <div className="bg-white dark:bgDarkMode flex-grow mr-2 mt-2 mb-2 rounded-lg p-4">
          {children}
        </div>
      </div>
    </>
  )
}
