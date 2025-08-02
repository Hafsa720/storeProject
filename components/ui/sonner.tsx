'use client'

import { useTheme } from 'next-themes'
import { toast, Toaster as Sonner } from 'sonner'
import { useEffect } from 'react'

const useToaster = () => {
  const { theme = 'system' } = useTheme()

  useEffect(() => {
    // Any theme-dependent config if needed
  }, [theme])

  return {
    toast,
    Toaster: () => (
      <Sonner
        theme={theme as 'light' | 'dark' | 'system'}
        className='toaster group'
        style={
          {
            '--normal-bg': 'var(--popover)',
            '--normal-text': 'var(--popover-foreground)',
            '--normal-border': 'var(--border)',
          } as React.CSSProperties
        }
      />
    ),
  }
}

export { useToaster }
