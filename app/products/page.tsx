import ProductsContainer from '@/components/product/ProductsContainer';
import React from 'react'

export default function ProductsPage({searchParams}: {searchParams: {layout?:string;search?:string}}) {
  const layout=searchParams.layout || 'grid';
  const search=searchParams.search || '';
  return (
  <ProductsContainer layout={layout} search={search}/>
  )
}
