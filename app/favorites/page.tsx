import React from 'react'

import SectionTitle from '@/components/global/SectionTitle'
import ProductsGrid from '@/components/product/ProductsGrid'
import { fetchFavoriteProducts } from '@/utils/actions'

//import type { Favorite } from '@clerk/nextjs'

async function page() {
  const favorites = await fetchFavoriteProducts()
  if (favorites.length === 0) {
    return <SectionTitle text='you have no favorites yet.' />
  }
  console.log(favorites, favorites.length)
  return (
    <div>
      <SectionTitle text='Favorites' />
      <ProductsGrid products={favorites} />
    </div>
  )
}

export default page
