import React from 'react'
import { Button } from '@/components/ui/button'
function AddToCart({productId}:{productId:string}) {
  return (
    <Button className='capitaliza mt-8 ' size='lg'>add to Cart</Button>
  )
}

export default AddToCart