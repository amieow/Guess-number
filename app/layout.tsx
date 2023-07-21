import { Suspense } from 'react'
import './globals.css'
import type { Metadata } from 'next'
import Loading from './loading'

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
  
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='dark' lang='en'>
      <body className='flex flex-col min-h-screen min-w-full' >
        <Suspense fallback={<Loading/>}>
          {children}
        </Suspense>
      </body>
    </html>
    
  )
}
