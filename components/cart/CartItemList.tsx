'use client'
import { CartItemWithProduct } from '@/utils/types'
import { Card } from '@/components/ui/card'
import { FirstColumn, FourthColumn } from './CartColumns'
import { SecondColumn } from './CartColumns'
import ThirdColumn from './ThirdColumn'

//import ThirdColumn from "./ThirdColumn"
function CartItemList({ cartItems }: { cartItems: CartItemWithProduct[] }) {
  return (
    <div>
      {cartItems.map((cartItem) => {
        const { id, amount } = cartItem
        const { image, name, price, id: productId } = cartItem.product
        return (
          <Card key={id} className='grid  gap-x-4  p-5 border-b lg:grid-cols-4'>
            <FirstColumn image={image} name={name} />
            <SecondColumn
              name={name}
              company={cartItem.product.company}
              productId={productId}
            />
            <ThirdColumn id={id} quantity={amount} />
            <FourthColumn price={price * amount} />
          </Card>
        )
      })}
    </div>
  )
}
export default CartItemList
