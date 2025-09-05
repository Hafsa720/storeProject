'use client'
import React, { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import SelectProductAmount, { Mode } from './SelectProductAmount'
import FormContainer from '../form/FormContainer'
import { addToCartAction } from '@/utils/actions'
import { ProductSignIn, SubmitButton } from '../form/Button'
function AddToCart({ productId }: { productId: string }) {
  const [amount, setAmount] = useState(1)
  const { userId } = useAuth()

  return (
    <div className='mt-6'>
      <SelectProductAmount
        mode={Mode.SingleProduct}
        amount={amount}
        setAmount={setAmount}
      />
      {userId ? (
        <FormContainer action={addToCartAction}>
          <input type='hidden' name='productId' value={productId} />
          <input type='hidden' name='amount' value={amount} />
          <SubmitButton text='add to cart' className='mt-8' />
        </FormContainer>
      ) : (
        <ProductSignIn />
      )}
    </div>
  )
}

export default AddToCart
