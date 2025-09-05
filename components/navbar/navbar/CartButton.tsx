import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { fetchCartItems } from '@/utils/actions'
async function CartButton() {
  const itemsInCart = await fetchCartItems()
  return (
    <Button
      variant='outline'
      size='icon'
      asChild
      className='flex justify-center items-center relative'
    >
      <Link href='/cart'>
        <ShoppingCart className='h-6 w-6' />
        <span className='absolute -top-3 -right-3 bg-primary text-white rounded-full h-6 w-6 items-center flex justify-center '>
          {itemsInCart}
        </span>
      </Link>
    </Button>
  )
}

export default CartButton
