import React from 'react'
import { Button } from '../ui/button'
import HeroCarousel from './HeroCarousel'
import Link from 'next/link'
function Hero() {
  return (
    <section className='grid grid-cols-1 lg:grid-cols-2 gap-24 items-center pt-20'>
      <div>
        <h1 className='text-4xl font-bold tracking-tight max-w-2xl sm:text-5xl'>
          We are changing the way people think
        </h1>
        <p className='mt-8 max-w-xl text-lg leading-8 text-muted-foreground'>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae
          inventore itaque quia similique veniam optio praesentium incidunt
        </p>
        <Button asChild size='lg' className='mt-10'>
<Link href='/products'>Our Products</Link>
        </Button>
      </div>
      <HeroCarousel/>
    </section>
  )
}

export default Hero
