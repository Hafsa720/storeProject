'use server'
import type { Cart, Product } from '@prisma/client'
import type { Favorite } from '@prisma/client'
import type { Prisma } from '@prisma/client'

import db from '@/utils/db'
import { currentUser, auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import {
  imageSchema,
  productSchema,
  validateWithZodSchema,
  reviewSchema,
} from './schemas'
import { deleteImage, uploadImage } from './suphabase'
import { revalidatePath } from 'next/cache'
import { includes } from 'zod'

/* --------------------------- AUTH HELPERS --------------------------- */
const getAuthUser = async () => {
  const user = await currentUser()
  if (!user) redirect('/')
  return user
}

const getAdminUser = async () => {
  const user = await getAuthUser()
  if (user?.id !== process.env.ADMIN_USER_ID) redirect('/')
  return user
}

const renderError = (error: unknown): { message: string } => {
  console.error(error)
  return {
    message: error instanceof Error ? error.message : 'There was an error...',
  }
}

/* --------------------------- PRODUCT QUERIES --------------------------- */
export const FetchProducts = async () => {
  return await db.product.findMany({
    where: { featured: true },
  })
}

export const FetchAllProducts = async ({ search = '' }: { search: string }) => {
  return await db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
}

export const FetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({ where: { id: productId } })
  if (!product) redirect('/products')
  return product
}

/* --------------------------- PRODUCT ACTIONS --------------------------- */
export const CreateProductAction = async (
  prevState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser()
  try {
    const rawData = Object.fromEntries(formData)
    const file = formData.get('image') as File

    // normalize keys
    const normalized = {
      name: (rawData['product name'] ?? rawData.name ?? '').toString().trim(),
      company: (rawData.company ?? '').toString().trim(),
      description: (rawData.description ?? '').toString().trim(),
      price: Number(rawData.price ?? 0),
      featured: String(rawData.featured ?? 'false') === 'true',
    }

    const validatedData = validateWithZodSchema(productSchema, normalized)
    if ('error' in validatedData) return { message: validatedData.error }

    const validatedImage = validateWithZodSchema(imageSchema, { image: file })
    if ('error' in validatedImage) return { message: validatedImage.error }

    const fullPath = await uploadImage(validatedImage.image)
    await db.product.create({
      data: {
        ...validatedData,
        image: fullPath,
        clerkId: user.id,
      },
    })
  } catch (error) {
    return renderError(error)
  }
  redirect('/admin/products')
}

export const fetchAdminProducts = async () => {
  await getAdminUser()
  return await db.product.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser()
  const product = await db.product.findUnique({ where: { id: productId } })
  if (!product) redirect('/admin/products')
  return product
}

export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser()
  try {
    const productId = formData.get('id') as string
    const rawData = Object.fromEntries(formData)
    const validatedData = validateWithZodSchema(productSchema, rawData)

    await db.product.update({
      where: { id: productId },
      data: validatedData,
    })

    revalidatePath(`/admin/products/${productId}/edit`)
    return { message: 'Product updated successfully' }
  } catch (error) {
    return renderError(error)
  }
}

export const updateProductImageAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAuthUser()
  try {
    const image = formData.get('image') as File
    const productId = formData.get('id') as string
    const oldImageUrl = formData.get('url') as string

    const validatedImage = validateWithZodSchema(imageSchema, { image })
    if ('error' in validatedImage) return { message: validatedImage.error }

    const fullPath = await uploadImage(validatedImage.image)
    await deleteImage(oldImageUrl)

    await db.product.update({
      where: { id: productId },
      data: { image: fullPath },
    })

    revalidatePath(`/admin/products/${productId}/edit`)
    return { message: 'Product Image updated successfully' }
  } catch (error) {
    return renderError(error)
  }
}

export const deleteProductAction = async (prevState: { productId: string }) => {
  await getAdminUser()
  try {
    const product = await db.product.delete({
      where: { id: prevState.productId },
    })
    await deleteImage(product.image)
    revalidatePath('/admin/products')
    return { message: 'Product removed' }
  } catch (error) {
    return renderError(error)
  }
}

/* --------------------------- FAVORITES --------------------------- */
export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await getAuthUser()
  const favorite = await db.favorite.findFirst({
    where: { productId, clerkId: user.id },
    select: { id: true },
  })
  return favorite?.id || null
}

export const toggleFavoriteAction = async (prevState: {
  productId: string
  favoriteId: string | null
  pathname: string
}) => {
  const user = await getAuthUser()
  const { productId, favoriteId, pathname } = prevState
  try {
    if (favoriteId) {
      await db.favorite.delete({ where: { id: favoriteId } })
    } else {
      await db.favorite.create({
        data: { productId, clerkId: user.id },
      })
    }
    revalidatePath(pathname)
    return { message: favoriteId ? 'Removed from Faves' : 'Added to Faves' }
  } catch (error) {
    return renderError(error)
  }
}

type FavoriteWithProduct = Prisma.FavoriteGetPayload<{
  include: { product: true }
}>

export const fetchFavoriteProducts = async (): Promise<Product[]> => {
  const user = await getAuthUser()
  const favorites: FavoriteWithProduct[] = await db.favorite.findMany({
    where: { clerkId: user.id },
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  })
  return favorites.map((fav) => fav.product)
}
export const createReviewAction = async (
  productId: string,
  formData: FormData
) => {
  console.log(productId, formData)
  try {
    const user = await getAuthUser()
    const rawData = Object.fromEntries(formData)

    const validatedFields = validateWithZodSchema(reviewSchema, rawData)
    if ('error' in validatedFields) return { message: validatedFields.error }

    await db.review.create({
      data: { ...validatedFields, clerkId: user.id },
    })

    revalidatePath(`/products/${validatedFields.productId}`)
    return { message: 'Review submitted successfully' }
  } catch (error) {
    console.log('error : ', error)
    return renderError(error)
  }
}

export const fetchProductReviews = async (productId: string) => {
  const reviews = await db.review.findMany({
    where: {
      productId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return reviews
}

export const fetchProductRating = async (productId: string) => {
  const result = await db.review.groupBy({
    by: ['productId'],
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
    where: {
      productId,
    },
  })

  // empty array if no reviews
  return {
    rating: result[0]?._avg.rating?.toFixed(1) ?? 0,
    count: result[0]?._count.rating ?? 0,
  }
}

export const fetchProductReviewsByUser = async () => {
  const user = await getAuthUser()
  const reviews = await db.review.findMany({
    where: {
      clerkId: user.id,
    },
    select: {
      id: true,
      rating: true,
      comment: true,
      product: {
        select: {
          image: true,
          name: true,
        },
      },
    },
  })
  return reviews
}
export const deleteReviewAction = async (prevState: { reviewId: string }) => {
  const { reviewId } = prevState
  const user = await getAuthUser()

  try {
    await db.review.delete({
      where: {
        id: reviewId,
        clerkId: user.id,
      },
    })
    revalidatePath('/reviews')
    return { message: 'review deleted successfully' }
  } catch (error) {
    return renderError(error)
  }
}
export const FindExistingReview = async (userId: string, productId: string) => {
  return db.review.findFirst({
    where: {
      clerkId: userId,
      productId,
    },
  })
}

export const fetchCartItems = async () => {
  const { userId } = await auth()
  const cart = await db.cart.findFirst({
    where: {
      clerkId: userId ?? '',
    },
    select: {
      numItemsInCart: true,
    },
  })
  return cart?.numItemsInCart || 0
}
export const addToCartAction = async (prevState: any, formData: FormData) => {
  const user = await getAuthUser()
  try {
    const productId = formData.get('productId') as string
    const amount = Number(formData.get('amount'))
    await fetchProduct(productId)
    const cart = await fetchOrCreateCart({ userId: user.id })
    await updateOrCreateCartItem({ productId, cartId: cart.id, amount })
    await updateCart(cart)
  } catch (error) {
    return renderError(error)
  }
  redirect('/cart')
}
const updateOrCreateCartItem = async ({
  productId,
  cartId,
  amount,
}: {
  productId: string
  cartId: string
  amount: number
}) => {
  let cartItem = await db.cartItem.findFirst({
    where: { cartId, productId },
  })
  if (cartItem) {
    cartItem = await db.cartItem.update({
      where: { id: cartItem.id },
      data: {
        amount: cartItem.amount + amount,
      },
    })
  } else {
    cartItem = await db.cartItem.create({
      data: {
        cartId,
        productId,
        amount,
      },
    })
  }
}

const fetchProduct = async (productId: string) => {
  const product = await db.product.findUnique({ where: { id: productId } })
  console.log('product : ', product)
  if (!product) {
    throw new Error('Product not found')
  }
  return product
}
const IncludeProductClause = {
  cartItems: {
    include: {
      product: true,
    },
  },
}

export const fetchOrCreateCart = async ({
  userId,
  errorOnFailure = false,
}: {
  userId: string
  errorOnFailure?: boolean
}) => {
  let cart = await db.cart.findFirst({
    where: { clerkId: userId },
    include: IncludeProductClause,
  })
  if (!cart && errorOnFailure) {
    throw new Error('Cart not found')
  }
  if (!cart) {
    cart = await db.cart.create({
      data: { clerkId: userId },
      include: IncludeProductClause,
    })
  }
  return cart
}

export const updateCart = async (cart: Cart) => {
  const cartItems = await db.cartItem.findMany({
    where: { cartId: cart.id },
    include: { product: true },
    orderBy: { createdAt: 'asc' },
  })
  let numItemsInCart = 0
  let cartTotal = 0
  for (const item of cartItems) {
    numItemsInCart += item.amount
    cartTotal += item.amount * item.product.price
  }
  const tax = cart.taxRate * cartTotal
  const shipping = cartTotal ? cart.shipping : 0
  const orderTotal = cartTotal + tax + shipping

  const updatedCart = await db.cart.update({
    where: { id: cart.id },
    data: { numItemsInCart, cartTotal, tax, shipping, orderTotal },
    include: IncludeProductClause,
  })
  return { cartItems, updatedCart }
}

export const removeCartItemAction = async (
  prevState: any,
  formData: FormData
) => {
  const user = await getAuthUser()
  try {
    const cartItemId = formData.get('id') as string
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    })

    await db.cartItem.delete({
      where: { id: cartItemId, cartId: cart.id },
    })
    await updateCart(cart)
    revalidatePath('/cart')
    return { message: 'Item removed from cart' }
  } catch (error) {
    return renderError(error)
  }
}

export const updateCartItemAction = async ({
  amount,
  cartItemId,
}: {
  amount: number
  cartItemId: string
}) => {
  const user = await getAuthUser()

  try {
    const cart = await fetchOrCreateCart({
      userId: user.id,
      errorOnFailure: true,
    })
    await db.cartItem.update({
      where: {
        id: cartItemId,
        cartId: cart.id,
      },
      data: {
        amount,
      },
    })
    await updateCart(cart)
    revalidatePath('/cart')
    return { message: 'cart updated' }
  } catch (error) {
    return renderError(error)
  }
}

export const createOrderAction = async (prevState: any, formData: FormData) => {
  return { message: 'Order created successfully' }
}
