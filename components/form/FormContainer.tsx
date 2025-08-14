'use client'
import React, { use, useActionState } from 'react'

import { useFormState } from 'react-dom'
import { useEffect } from 'react'
import { useToaster } from '@/components/ui/sonner'
import { actionFunction } from '@/utils/types'

const initialState={
  message:'',
}
function FormContainer({action,children}: {action: actionFunction, children: React.ReactNode}) {
  const [state,formAction]= useActionState(action, initialState)
  const { toast } = useToaster()
  useEffect(()=>{
    if (state.message) {
      toast(state.message)
    }
  },[state])
  return <form action={formAction} className='w-full'>
    {children}
  </form>}


export default FormContainer