import React from 'react'

import { Button } from '../ui/button'
import { auth } from '@clerk/nextjs/server'
import { CardSignInButton } from '../form/Button'
import { fetchFavoriteId } from '@/utils/actions'
import FavouriteToggleForm from './FavouriteToggleForm'
function FavouriteToggleButton({ productsId }: { productsId: string }) {
  const [userId, setUserId] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchAuth() {
      const session = await auth()
      setUserId(session?.userId ?? null)
    }
    fetchAuth()
  }, [])
  if (!userId) return <CardSignInButton />

  const [favoriteId, setFavouriteId] = React.useState<string | null>(null)

  React.useEffect(() => {
    async function fetchFavourite() {
      if (userId) {
        const favId = await fetchFavoriteId({ productId: productsId })
        setFavouriteId(favId)
      }
    }
    fetchFavourite()
  }, [userId, productsId])

  return <FavouriteToggleForm favoriteId={favoriteId} productId={productsId} />
}

export default FavouriteToggleButton
