import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar/navbar/Navbar'
import ThemeProvider from '@/app/themeprovider'
import Container from '@/components/global/Container'
import { ClerkProvider } from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'next storeFront',
  description: 'A nifty storefront built with Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider>
            <Navbar />
            <Container className='flex flex-col'>{children}</Container>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
