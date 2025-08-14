import React from 'react'
import EmptyList from '@/components/global/EmptyList'
import { fetchAdminProducts } from '@/utils/actions'
import Link from 'next/link'
import { formatCurrency } from '@/utils/format'

type AdminProduct = {
  id: string
  name: string
  company: string
  price: number
  description: string
}

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

async function AdminProductspage() {
  const products = await fetchAdminProducts()

  if (!products || products.length === 0) {
    return <EmptyList heading='No products found' />
  }

  return (
    <section>
      <Table>
        <TableCaption className='capitalize'>
          total products: {products.length}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[100px]'>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product: AdminProduct) => {
            const { id, name, company, price, description } = product
            return (
              <TableRow key={id}>
                <TableCell>{id}</TableCell>
                <TableCell>
                  <Link
                    href={`/products/${id}`}
                    className='underline text-muted-foreground tracking-wide capitalize'
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell className='capitalize'>{company}</TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>
                <TableCell>{description}</TableCell>
                <TableCell>
                  <Link
                    href={`/admin/products/edit/${id}`}
                    className='text-blue-500 underline'
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}

export default AdminProductspage
