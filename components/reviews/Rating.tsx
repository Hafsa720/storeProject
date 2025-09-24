import React from 'react'
import { FaRegStar, FaStar } from 'react-icons/fa'

function Rating({ rating }: { rating: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1)
  return (
    <div className='flex items-center gap-x-1'>
      {stars.map((star, i) => {
        const isFilled = star <= rating
        const classname = `w-3 h-3 ${
          isFilled ? 'text-primary' : 'text-grey-400'
        }`
        return isFilled ? (
          <FaStar className={classname} key={i} />
        ) : (
          <FaRegStar className={classname} key={i} />
        )
      })}
    </div>
  )
}

export default Rating
