import React from 'react'
import ProductsGrid from './ProductsGrid'
import ProductsList from './ProductsList'
import { LuLayoutGrid, LuLayoutList, LuList } from 'react-icons/lu'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { FetchAllProducts } from '@/utils/actions'
import Link from 'next/link'

async function ProductsContainer({
  layout,
  search,
}: {
  layout: string
  search: string
}) {
  const products = await FetchAllProducts({search})
  const totalProducts = products.length
  const searchTerm = search ? `&search=${search}` : ''

  return (
    <>
      {/*HEADER*/}
      <section>
        <div className='flex justify-between items-center'>
          <h4 className='text-3xl font-semibold mt-16 mb-4'>
            {totalProducts}  product{totalProducts > 1 ? 's' : ''}
          </h4>
          <div className='flex gapx-4'>
            <Button
              variant={layout === 'grid' ? 'default' : 'ghost'}
              size='icon'
              asChild>
              <Link href={`/products?layout=grid${searchTerm}`}>
                <LuLayoutGrid />
              </Link>
            </Button>
            <Button
              variant={layout === 'list' ? 'default' : 'ghost'}
              size='icon'
              asChild>
              <Link href={`/products?layout=list${searchTerm}`}>
                <LuList />
              </Link>
            </Button>
          </div>
        </div>
        <Separator className='mt-4'/>
      </section>
      {/*PRODUCTS */}
      <div>
        {products.length === 0 ? (
          <h5 className='text-4xl mt-16'>NO,Products found</h5>
        ) : layout === 'grid' ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
      </div>
    </>
  )
}

export default ProductsContainer
