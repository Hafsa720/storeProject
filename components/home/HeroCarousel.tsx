import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const Images = [
  '/images/hero1.jpg',
  '/images/hero2.jpg', 
  '/images/hero3.jpg',
  '/images/hero4.jpg'
]
function HeroCarousel() {
  return (
    <div className='hidden lg:block'>
      <Carousel>
<CarouselContent>
  {Images.map((image,index)=>{
return <CarouselItem key={index} >
<Card>
  <CardContent>
    <Image src={image} alt='hero' className='w-full h-[24rem] rounded-md object-cover'/>
  </CardContent>
</Card>
</CarouselItem>
  })}
</CarouselContent>
<CarouselPrevious/>
<CarouselNext/>
      </Carousel>
    </div>
  )
}

export default HeroCarousel