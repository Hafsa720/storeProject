'use client'
import React from 'react'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import FormContainer from './FormContainer'
import { SubmitButton } from '@/components/form/Button'
import ImageInput from './ImageInput'
import { type actionFunction } from '@/utils/types'

type ImageInputContainerProps = {
  image: string
  name: string
  action: actionFunction
  text: string
  children?: React.ReactNode
}
function ImageInputContainer({
  image,
  action,
  text,
  children,
}: ImageInputContainerProps) {
  const [isUpdateFormVisisble] = useState(false)

  return (
    <div>
      <Image
        src={image}
        width={200}
        height={200}
        className='rounded object-cover mb-4 w-[200px] h-[200px]'
        alt='name'
        priority
      />
      <Button variant='outline' size='sm' onClick={(prev) => !prev}>
        {text}
      </Button>
      {isUpdateFormVisisble && (
        <div className='max-w-md mt-4'>
          <FormContainer action={action}>
            {children}
            <ImageInput />
            <SubmitButton size='sm' text={text} />
          </FormContainer>
        </div>
      )}
    </div>
  )
}

export default ImageInputContainer
