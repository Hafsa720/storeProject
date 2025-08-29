import EmptyList from '@/components/global/EmptyList'
import { fetchAdminProducts } from '@/utils/actions'
import Link from 'next/link'
import FormContainer from '@/components/form/FormContainer'
import { IconButton } from '@/components/form/Button'
import { deleteProductAction } from '@/utils/actions'
import { formatCurrency } from '@/utils/format'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

async function ItemsPage() {
  const items = await fetchAdminProducts()
  //const items: any = []
  if (items.length === 0) return <EmptyList />
  return (
    <section>
      <Table>
        <TableCaption className='capitalize'>
          total products : {items.length}
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item: any) => {
            const { id: productId, name, company, price } = item
            return (
              <TableRow key={productId}>
                <TableCell>
                  <Link
                    href={`/products/${productId}`}
                    className='underline text-muted-foreground tracking-wide capitalize'
                  >
                    {name}
                  </Link>
                </TableCell>
                <TableCell>{company}</TableCell>
                <TableCell>{formatCurrency(price)}</TableCell>

                <TableCell className='flex items-center gap-x-2'></TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </section>
  )
}

export default ItemsPage
