import ProductsContainer from '@/components/product/ProductsContainer'
import React from 'react'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ layout?: string; search?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const layout = resolvedSearchParams.layout || 'grid'
  const search = resolvedSearchParams.search || ''
  return <ProductsContainer layout={layout} search={search} />
}
