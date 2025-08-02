'use client'
import { Toaster } from 'sonner'
import React from 'react'
import ThemeProvider  from '@/app/themeprovider'
function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider
      >
      <Toaster />
        {children}
      </ThemeProvider>
    </>
  )
}

export default Providers
