import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import React from 'react'
import { ProductProvider } from '@/Context/ProductContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <ProductProvider>
        <Component {...pageProps} />
      </ProductProvider>
    </SessionProvider>
  )
}
