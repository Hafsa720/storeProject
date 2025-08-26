'use client'
import React from 'react'
import { adminLinks } from'@/utils/Links'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <aside className='w-full space-y-2 p-4'>
      {adminLinks.map((link) => {
        const isActive = pathname === link.href

        return (
          <Button
            key={link.href}
            asChild
            className='w-full mb-2 capitalize font-normal justify-start'
            variant={isActive ? 'default' : 'ghost'}
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        )
      })}
    </aside>
  )
}

export default Sidebar
