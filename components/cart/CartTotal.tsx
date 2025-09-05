import { Cart } from '@prisma/client'
import { formatCurrency } from '@/utils/format'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { Card, CardTitle } from '@/components/ui/card'
import FormContainer from '../form/FormContainer'
import { SubmitButton } from '../form/Button'
import { createOrderAction } from '@/utils/actions'
function CartTotal({ cart }: { cart: Cart }) {
  const { cartTotal, shipping, tax, orderTotal } = cart
  return (
    <div>
      <Card className='p-4  '>
        <CartTotalRows label='subtotal' amount={cartTotal} />
        <CartTotalRows label='shipping' amount={shipping} />
        <CartTotalRows label='tax' amount={tax} />

        <CardTitle className='mt-4'>
          <CartTotalRows label='order total' amount={orderTotal} lastRow />
        </CardTitle>
      </Card>
      <FormContainer action={createOrderAction}>
        <SubmitButton text='Place Order' className='w-full mt-8' />
      </FormContainer>
    </div>
  )
}
function CartTotalRows({
  label,
  amount,
  lastRow,
}: {
  label: string
  amount: number
  lastRow?: boolean
}) {
  return (
    <>
      <div className='flex justify-between text-sm'>
        <span>{label}</span>
        <span>{formatCurrency(amount)}</span>
      </div>
      {lastRow ? null : <Separator className='mt-2' />}
    </>
  )
}
export default CartTotal
