import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LuAlignLeft } from 'react-icons/lu'
import Link from 'next/link'
import { Button } from '../../ui/button'
import { links } from '@/utils/Links'
import UserIcon from './UserIcon'
import { SignedIn, SignedOut, SignInButton,SignUpButton } from '@clerk/nextjs'
import { DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import SignOutLink from './SignOutLink'

function LinkDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='flex gap-4 max-w-[100px]'>
          <LuAlignLeft className='h-4 w-4' />
          <UserIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-20' sideOffset={10}>
        <SignedOut>
          <DropdownMenuItem>
            <SignInButton mode='modal'>
              <button className='w-full text-left'> Login</button>
            </SignInButton>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SignUpButton mode='modal'>
              <button className='w-full text-left'> 
                Register
              </button>
            </SignUpButton>
          </DropdownMenuItem>
        </SignedOut>
        <SignedIn>
          {links.map((link) => {
            return (
              <DropdownMenuItem key={link.href}>
                <Link href={link.href} className='capitalize w-full'>
                  {link.label}
                </Link>{' '}
              </DropdownMenuItem>
            )
          })}
          <DropdownMenuSeparator/>
          <DropdownMenuItem>
            <SignOutLink/>
          </DropdownMenuItem>
        </SignedIn>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default LinkDropdown
