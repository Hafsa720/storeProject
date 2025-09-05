import React from 'react'
import BreadCrumbs from '@/components/single-product/BreadCrumbs'
import { FetchSingleProduct } from '@/utils/actions'
//import Image from 'next/image'
import { formatCurrency } from '@/utils/format'
import FavouriteToggleButton from '@/components/product/FavouriteToggleButton'
import AddToCart from '@/components/single-product/AddToCart'
import Image from 'next/image'
import ProductsRating from '@/components/single-product/ProductsRating'

import ProductReviews from '@/components/reviews/ProductReviews'
import SubmitReview from '@/components/reviews/SubmitReview'

async function SingleProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params
  const product = await FetchSingleProduct(resolvedParams.id)

  const { name, description, price, image, company } = product
  const dollarAmount = formatCurrency(price)
  return (
    <section>
      <BreadCrumbs name={product.name} />
      <div className='mt-6 grid gap-y-6 lg:grid-cols-2 lg:gap-x-16'>
        {/*IMAGE FIRST COL*/}
        <div className='relative h-full'>
          <Image
            src={image}
            alt='not found'
            fill
            sizes='(max-width:768px) 100vw,(max-width:1200px) 50vw 33vw'
            priority
            className='rounded  w-full  object-cover'
          />
        </div>
        {/*IMAGE SECOND COL*/}
        <div>
          <div className='flex items-center gap-x-8'>
            <h1 className='text-3xl capitalize font-bold'>{name}</h1>
            <FavouriteToggleButton productsId={resolvedParams.id} />
          </div>
          <ProductsRating />
          <h4 className='text-xl mt-2'>{company}</h4>
          <p className='mt-1 text-md bg-muted inline-block rounded'>
            {dollarAmount}
          </p>
          <p className='mt-6 leading-8 text-muted-foreground'>{description}</p>
          <AddToCart />
        </div>
      </div>
      <ProductReviews productId={params.id} />
      <SubmitReview productId={params.id} />
    </section>
  )
}

export default SingleProductPage
