import React from 'react'
import { formatCurrency } from '@/utils/format'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Product } from '@prisma/client'
import Image from 'next/image'
import FavouriteToggleButton from './FavouriteToggleButton'
function ProductsList({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map((product) => {
        const { name, price, image, company } = product
        const productId = product.id
        const dollarsAmount = formatCurrency(price)
        return (
          <article key={productId} className='group relative'>
            <Link href={`/products/${productId}`}>
              <Card className='transform group-hover:shadow-xl mt-5 transition-shadow duration-500'>
                <CardContent className='p-8 gap-y-4  grid md:grid-cols-3'>
                  <div className='relative h-64 md:h-48 w-48  '>
                    <Image
                      src={image}
                      alt={name}
                      fill
                      sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw 33vw'
                      priority
                      className='rounded  w-full  object-cover'
                    />
                  </div>

                  <div>
                    <h2 className=' flex text-lg  font-semibold capitalize'>
                      {name}
                    </h2>
                    <h4 className='text-muted-foreground mt-1'>{company}</h4>
                  </div>

                  <p className='  text-muted-foreground text-lg md:ml-auto '>
                    {dollarsAmount}
                  </p>
                </CardContent>
              </Card>
            </Link>
            <div className='absolute right-8 bottom-8 z-5'>
              <FavouriteToggleButton productsId={productId} />
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default ProductsList
