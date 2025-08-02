import React from 'react'
import Hero from '@/components/home/Hero'
import Featured from '@/components/home/Featured'
import { Suspense } from 'react'
import LoadingContainer from '@/components/global/LoadingContainer'
export default function HomePage() {
  return <>
  <Hero/>
  <Suspense fallback={<LoadingContainer/>}>

  <Featured/>
  </Suspense>
  </>
}
