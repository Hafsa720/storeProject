import React from 'react'
import EmptyList from '@/components/global/EmptyList'
import { fetchAdminProducts } from '@/utils/actions'
import Link from 'next/link'
import { formatCurrency } from '@/utils/format'
import FormContainer from '@/components/form/FormContainer'
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
import { IconButton } from '@/components/form/Button'

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

                <TableCell className='flex items-center gap-x-2'>
                  <Link
                    href={`/admin/products/${id}/edit`}
                    className='text-blue-500 underline'
                  >
                    <IconButton actionType='edit'/>
                  </Link>
<DeleteProduct productId={id} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}

// Import the deleteProductAction function from your actions utility
import { deleteProductAction } from '@/utils/actions'

function DeleteProduct({ productId }: { productId: string }) {
  const deleteProduct = deleteProductAction.bind(null, { productId })
  return (
    <FormContainer action={deleteProduct}>
      <IconButton actionType='delete' />
    </FormContainer>
  )
}
export default AdminProductspage
