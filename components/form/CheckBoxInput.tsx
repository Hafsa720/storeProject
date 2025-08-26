'use client'
import React from 'react'

import { Checkbox } from '@/components/ui/checkbox'

type CheckboxInputProps = {
  name: string
  label: string
  defaultChecked?: boolean
}
function CheckBoxInput({
  name,
  label,
  defaultChecked = false,
}: CheckboxInputProps) {
  return (
    <div className='flex items-center space-x-2'>
      {/* Hidden input ensures a value is always submitted when checkbox is unchecked */}
      <input type='hidden' name={name} value='false' />
      <Checkbox
        id={name}
        name={name}
        value='true'
        defaultChecked={defaultChecked}
      />
      <label
        htmlFor={name}
        className='text-sm leading-none capitalize peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
      >
        {label}
      </label>
    </div>
  )
}

export default CheckBoxInput
