import React from 'react'
import Container from '../../global/Container'
import Logo from './Logo'
import NavSearch from './NavSearch'
import CartButton from './CartButton'
import DarkMode from './DarkMode'

import LinkDropdown from './LinkDropdown'
import { Suspense } from 'react'
export default function Navbar() {
  return (
    <nav className='border-b'>
      <Container className='flex flex-col sm:flex-row sm:justify-between sm:items-center flex-wrap py-4 gap-4'>
        <Logo />
        <Suspense>
          <NavSearch />
        </Suspense>
        <div className='flex items-center gap-4'>
          <CartButton />
          <DarkMode />
          <LinkDropdown />
        </div>
      </Container>
    </nav>
  )
}
