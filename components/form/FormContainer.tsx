'use client'
import React, {  useActionState } from 'react'


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
  },[state,toast])
  return <form action={formAction} className='w-full'>
    {children}
  </form>}


export default FormContainer