'use client'

import React from 'react'
import { useUser } from '@clerk/nextjs'
import { CardSignInButton } from '../form/Button'
import { fetchFavoriteId } from '@/utils/actions'
import FavouriteToggleForm from './FavouriteToggleForm'

function FavouriteToggleButton({ productsId }: { productsId: string }) {
  const { user } = useUser() // client-side user
  const userId = user?.id

  if (!userId) return <CardSignInButton />

  const [favoriteId, setFavouriteId] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchFavourite() {
      const favId = await fetchFavoriteId({ productId: productsId })
      setFavouriteId(favId)
    }
    fetchFavourite()
  }, [productsId])

  return <FavouriteToggleForm favoriteId={favoriteId} productId={productsId} />
}

export default FavouriteToggleButton
