'use client'
import { useState } from 'react'
import SelectProductAmount from '../single-product/SelectProductAmount'
import { Mode } from '../single-product/SelectProductAmount'
import FormContainer from '../form/FormContainer'
import { SubmitButton } from '../form/Button'
import { removeCartItemAction, updateCartItemAction } from '@/utils/actions'
import { useToaster } from '../ui/sonner'
import { set } from 'zod'

type Props = {
  quantity: number
  id: string
}
function ThirdColumn({ quantity, id }: Props) {
  const [amount, setAmount] = useState(quantity)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToaster()
  const handleChange = async (value: number) => {
    setIsLoading(true)
    toast('updating cart item...')
    const result = await updateCartItemAction({ cartItemId: id, amount: value })
    toast.dismiss()
    if (!result) {
      toast.error('Failed to update cart item')
    }
    setIsLoading(false)
    setAmount(value)
  }
  return (
    <div className='flex flex-col items-start lg:items-center'>
      <SelectProductAmount
        amount={amount}
        setAmount={handleChange}
        mode={Mode.CartItem}
        isLoading={false}
      />
      <FormContainer action={removeCartItemAction}>
        <input type='hidden' name='id' value={id} />
        <SubmitButton className='text-sm mt-2 ml-13' size='sm' text='remove' />
      </FormContainer>
    </div>
  )
}
export default ThirdColumn
