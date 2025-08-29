'use client'
import React from 'react'

import { useRouter } from 'next/navigation'
import { useToaster } from '@/components/ui/sonner'

import { SignOutButton } from '@clerk/nextjs'
const SignOutLink = () => {
  const router = useRouter()
  const { toast } = useToaster()

  const handleSignOut = () => {
    toast('logout Successfully')
    router.push('/')
  }
  return (
    <SignOutButton>
      <button onClick={handleSignOut}>Signout</button>
    </SignOutButton>
  )
}

export default SignOutLink
