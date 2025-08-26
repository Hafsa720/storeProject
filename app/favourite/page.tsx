import SectionTitle from '@/components/global/SectionTitle'
import ProductsGrid from '@/components/product/ProductsGrid'
import { fetchFavoriteProducts } from '@/utils/actions'
import { fa } from '@faker-js/faker'
import React from 'react'

import type { Favorite } from '@clerk/nextjs'

async function page() {
  const favorites = await fetchFavoriteProducts()
  if (favorites.length === 0) {
    return <SectionTitle text='you have no favorites yet.' />
  }
  return (
    <div>
      <SectionTitle text='Favourites' />
      <ProductsGrid products={favorites.map((favorite: Favorite) => favorite.product)} />
    </div>
  )
}

export default page
