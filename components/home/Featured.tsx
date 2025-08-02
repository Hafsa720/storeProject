import { FetchProducts } from '@/utils/actions'
import React from 'react'
import EmptyList from '../global/EmptyList'
import SectionTitle from '../global/SectionTitle'
import ProductsGrid from '../product/ProductsGrid'

async function Featured() {
  const products = await FetchProducts()
  if (products.length === 0) return <EmptyList />
  return (
    <section className='pt-24'>
      <SectionTitle text='Featured Products' />
      <ProductsGrid products={products} />
    </section>
  )
}

export default Featured
