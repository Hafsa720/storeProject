import CartItemList from '@/components/cart/CartItemList'
import CartTotal from '@/components/cart/CartTotal'
import SectionTitle from '@/components/global/SectionTitle'
import { fetchOrCreateCart, updateCart } from '@/utils/actions'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import React from 'react'

async function CartPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')
  const previousCart = await fetchOrCreateCart({ userId })
  const cart = await updateCart(previousCart)
  if (cart.cartItems.length === 0) return <SectionTitle text='Cart Empty' />
  return (
    <>
      <SectionTitle text='Shopping Cart' />
      <div className='mt-3    gap-10 justify-between width-full lg:grid lg:grid-cols-3'>
        <div className='lg:col-span-2'>
          {/* cart item list */}
          <CartItemList cartItems={cart.cartItems} />
        </div>
        <div className='lg:col-span-1 lg:ml-8 mt-8 lg:mt-0'>
          <CartTotal cart={cart.updatedCart} />
        </div>
      </div>
    </>
  )
}
export default CartPage
