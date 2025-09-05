import React from 'react'
import { Product } from '@prisma/client'
import { formatCurrency } from '@/utils/format'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '../ui/card'
import FavouriteToggleButton from './FavouriteToggleButton'
function ProductsGrid({ products }: { products: Product[] }) {
  return (
    <div className='pt-12 grid gap-34 md:grid-cols-2 lg:grid-cols-3 '>
      {products.map((product, index) => {
        const { name, price, image } = product
        const productId = product.id
        const dollarsAmount = formatCurrency(price)
        console.log(' productId : ', productId)
        return (
          <article key={index} className='group relative '>
            <Link href={`/products/${productId}`}>
              <Card className='transform  w-100  group-hover:shadow-xl transition-shadow duration-500'>
                <CardContent className='p-2 md:p-4'>
                  <div className='relative h-64 md:h-48 w-90  rounded overflow-hidden'>
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw 33vw'
                      priority
                      className='rounded h-64 p-2 w-full  object-cover transform group-hover:scale-110 transition-transform duration-500'
                    />
                  </div>
                  <div className='mt-4  text-center'>
                    <h2 className='text-lg  capitalize '>{name}</h2>
                    <p className='text-muted-foreground mt-2'>
                      {dollarsAmount}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <div className='absolute top-14 left-80'>
              <FavouriteToggleButton productsId={productId} />
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default ProductsGrid
