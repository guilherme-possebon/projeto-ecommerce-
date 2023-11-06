import Head from 'next/head'
import { useSession, signIn } from 'next-auth/react'
import Nav from './Nav'
import { type ReactNode, useState } from 'react'
import Logo from './Logo'
import React from 'react'

interface LayoutProp {
  children: ReactNode
}
export default function Layout({ children }: LayoutProp) {
  const [showNav, setShowNav] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  const { data: session } = useSession()
  console.log(session, 111)
  const handleSignInGoogle = async () => {
    await signIn('google')
  }
  const handleSignInGitHub = async () => {
    await signIn('github')
  }
  if (session === null) {
    return (
      <>
        <div className="bg-bgGray dark:bgDarkMode w-screen h-screen flex items-center">
          <div className="text-center w-full">
            <button
              className="bg-white dark:bgDarkMode p-2 px-4 rounded-lg"
              onClick={() => {
                void handleSignInGoogle()
              }}
            >
              Logar com google
            </button>
          </div>
          <div className="text-center w-full">
            <button
              className="bg-white dark:bgDarkMode p-2 px-4 rounded-lg"
              onClick={() => {
                void handleSignInGitHub()
              }}
            >
              Logar com github
            </button>
          </div>
        </div>
      </>
    )
  }
  function HandleClickButtonToShow() {
    setShowNav(!showNav)
    setShowLogo(!showLogo)
  }
  return (
    <>
      <Head>
        <title>Nome da empresa</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-bgGray">
        <div className="flex items-center md:hidden p-4">
          <button onClick={HandleClickButtonToShow}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div className="flex grow justify-center mr-6">
            <Logo showLogo={showLogo} />
          </div>
        </div>
        <div className=" flex min-h-screen dark:bgDarkMode">
          <Nav showNav={showNav} />
          <div className=" dark:bgDarkMode flex-grow p-4">{children}</div>
        </div>
      </div>
    </>
  )
}
