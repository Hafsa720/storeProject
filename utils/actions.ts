'use server'
import type { Product } from '@prisma/client'
import type { Favorite } from '@prisma/client'
import type { Prisma } from '@prisma/client'

import db from '@/utils/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { imageSchema, productSchema, validateWithZodSchema } from './schemas'
import { deleteImage, uploadImage } from './suphabase'
import { revalidatePath } from 'next/cache'

/* --------------------------- AUTH HELPERS --------------------------- */
const getAuthUser = async () => {
  const user = await currentUser()
  if (!user) redirect('/')
  return user
}

const getAdminUser = async () => {
  const user = await getAuthUser()
  if (user.id !== process.env.ADMIN_ID) redirect('/')
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
