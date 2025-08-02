import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { VscCode } from 'react-icons/vsc'
export default function Logo() {
  return (
    <Button size='icon' asChild>
      <Link href='/'>
      <VscCode className='h-6 w-6' />
      </Link>
    </Button>
  ) 
}
