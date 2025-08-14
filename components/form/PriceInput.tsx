import React from 'react'

import { Label } from '../ui/label'
import { Input } from '../ui/input'

const name = 'price'
type FormInputNumberProps = {
  defaultValue?: number
}
function PriceInput({ defaultValue }: FormInputNumberProps) {
  return (
    <div className='mb-2'>
      <Label htmlFor={name} className='mb-3 capitalize'>
        Price ($)
      </Label>
      <Input
        id={name}
        name={name}
        type='number'
        defaultValue={defaultValue || 100}
        min={0}
        required
      />
    </div>
  )
}

export default PriceInput
