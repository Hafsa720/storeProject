import React, { use } from 'react'
import Link from 'next/link'
import { useToaster } from '@/components/ui/sonner'

import { SignOutButton } from '@clerk/nextjs'
function SignOutLink() {
  const { toast } = useToaster()

  const handleSignOut = () => {
    toast('logout Successfully')
  }
  return (
    <SignOutButton>
      <Link href='/' className='w-full text-left' onClick={handleSignOut}>
        Logout
      </Link>
    </SignOutButton>
  )
}

export default SignOutLink
