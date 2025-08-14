import React from 'react'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

type TextAreaInputProps = {
  name: string
  labelText?: string
  defaultValue?: string
}
function TextArea({ name, labelText, defaultValue }: TextAreaInputProps) {
  return (
    <div className='mb-3'>
      <Label htmlFor={name} className=' capitalize'>{labelText||name}</Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        className='mt-2 leading-loose'
        rows={4}
        required/>
    </div>
  )
}

export default TextArea