import { Separator } from '@/components/ui/separator'
import React from 'react'
import Sidebar from './sidebar'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h2 className='text-2xl pl-4'>Dashboard</h2>
      <Separator className='mt-2' />
      <section className='grid gap-12 mt-12'>
        <div className='flex flex-col-2 gap-24'>
          <div className='lg:col-span-2 '>
            <Sidebar />
          </div>
          <div className=' container lg:col-span-10 w-full '>{children}</div>
        </div>
      </section>
    </>
  )
}

export default DashboardLayout
