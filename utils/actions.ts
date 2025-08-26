'use server'

import db from '@/utils/db'
import { currentUser } from '@clerk/nextjs/server'
import { log } from 'console'
import { redirect } from 'next/navigation'
import { imageSchema, productSchema, validateWithZodSchema } from './schemas'
import { deleteImage, uploadImage } from './suphabase'

const getAuthUser = async () => {
  const user = await currentUser()
  if (!user) {
    redirect('/')
  }
  return user
}

const getAdminUser = async () => {
  const user = await getAuthUser()
  if (user.id !== process.env.ADMIN_ID) {
    redirect('/')
  }
}
const renderError = (error: unknown): { message: string } => {
  console.log(error)
  return {
    message: error instanceof Error ? error.message : 'there was an error...',
  }
}
export const FetchProducts = async () => {
  const products = await db.product.findMany({
    where: {
      featured: true,
    },
    //to specify happening of object
    //select:{
    // name:true
    //}
  })
  return products
}
export const FetchAllProducts = async ({ search = '' }: { search: string }) => {
  return await db.product.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ],
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}

export const FetchSingleProduct = async (productId: string) => {
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  })
  if (!product) redirect('/products')
  return product
}

export const CreateProductAction = async (
  prevvState: any,
  formData: FormData
): Promise<{ message: string }> => {
  const user = await getAuthUser()
  console.log('user::::', user)
  try {
    const rawData = Object.fromEntries(formData)
    const file = formData.get('image') as File

    // Normalize form keys to match productSchema
    const normalized = {
      name: (rawData['product name'] ?? rawData.name ?? '').toString().trim(),
      company: (rawData.company ?? '').toString().trim(),
      description: (rawData.description ?? '').toString().trim(),
      // price should be a number for the schema
      price: Number(rawData.price ?? 0),
      // featured checkbox will be submitted as 'true' or 'false' (hidden input ensures presence)
      featured: String(rawData.featured ?? 'false') === 'true',
      // include any other fields your schema expects here
    }

    console.log('rawData::::', rawData)
    console.log('normalized::::', normalized)

    const validatedData = validateWithZodSchema(productSchema, normalized)
    console.log('validatedData::::', validatedData)
    if ('error' in validatedData) {
      return { message: validatedData.error }
    }

    const validatedImage = validateWithZodSchema(imageSchema, { image: file })
    if ('error' in validatedImage) {
      return { message: validatedImage.error }
    }
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
console.log(CreateProductAction)
export const fetchAdminProducts = async () => {
  await getAdminUser()
const products =await db.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
  return products
}

import { revalidatePath } from 'next/cache'
import { get } from 'http'
import { id } from 'zod/v4/locales'

export const deleteProductAction = async (prevState: { productId: string }) => {
  const { productId } = prevState
  await getAdminUser()

  try {
   const product=  await db.product.delete({
      where: {
        id: productId,
      },
    })
 await deleteImage(product.image)
    revalidatePath('/admin/products')
    return { message: 'product removed' }
  } catch (error) {
    return renderError(error)
  }
}
export const fetchAdminProductDetails = async (productId: string) => {
  await getAdminUser()
  const product = await db.product.findUnique({
    where: {
      id: productId,
    },
  })
  if (!product) redirect('/admin/products')
  return product
}

export const updateProductAction = async (
  prevState: any,
  formData: FormData
) => {
  await getAdminUser()
  try {
    const productId= formData.get('id') as string
    const rawData = Object.fromEntries(formData)
    const validatedData= validateWithZodSchema(productSchema, rawData)  

await db.product.update({
      where: {  
        id: productId,},
      data: {
        ...validatedData,
      },})

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
    const image= formData.get('image') as File
    const productId = formData.get('id') as string
    const oldImageUrl = formData.get('url') as string
    const validatedImage = validateWithZodSchema(imageSchema, { image })
    if ('error' in validatedImage) {
      return { message: validatedImage.error }
    }
    const fullPath = await uploadImage(validatedImage.image)
    await deleteImage(oldImageUrl)
    await db.product.update({
      where: {
        id: productId,
      },
      data: {
        image: fullPath,
      },
    })
    revalidatePath(`/admin/products/${productId}/edit`)

    return { message: 'Product Image updated successfully' }
  } catch (error) {
    return renderError(error)
  }
}
export const fetchFavoriteId = async ({ productId }: { productId: string }) => {
  const user = await getAuthUser()
  const favorite = await db.favorite.findFirst({
    where: {
      productId,
      clerkId: user.id,
    },
    select: {
      id: true,
    },
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
      await db.favorite.delete({
        where: {
          id: favoriteId,
        },
      })
    } else {
      await db.favorite.create({
        data: {
          productId,
          clerkId: user.id,
        },
      })
    }
    revalidatePath(pathname)
    return { message: favoriteId ? 'Removed from Faves' : 'Added to Faves' }
  } catch (error) {
    return renderError(error)
  }
}

export const fetchFavoriteProducts = async () => {
  const user = await getAuthUser()
  const favorites = await db.favorite.findMany({
    where: {
      clerkId: user.id,
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  return favorites.map((fav: Favorite) => fav.product)
}