import { fetchProductReviews } from '@/utils/actions'
import SectionTitle from '../global/SectionTitle'
import Image from 'next/image'

async function ProductReviews({ productId }: { productId: string }) {
  const reviews = await fetchProductReviews(productId)

  return (
    <div className='mt-6'>
      <SectionTitle text='Product Reviews' />
      {reviews?.map((review) => {
        const { comment, rating, authorImageUrl, authorName } = review
        return (
          <div key={review.id} className='border p-4 rounded-lg mb-3'>
            <div className='flex items-center gap-3'>
              <Image
                src={authorImageUrl}
                alt={authorName}
                width={40}
                height={40}
                className='w-10 h-10 rounded-full'
              />
              <h3 className='font-semibold'>{authorName}</h3>
            </div>
            <p className='mt-2 text-sm text-gray-700'>{comment}</p>
            <p className='text-yellow-500'>Rating: {rating}</p>
          </div>
        )
      })}
    </div>
  )
}

export default ProductReviews
