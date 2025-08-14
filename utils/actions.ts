'use server'

import db from '@/utils/db'
import { currentUser } from '@clerk/nextjs/server'
import { log } from 'console'
import { redirect } from 'next/navigation'
import { imageSchema, productSchema, validateWithZodSchema } from './schemas'
import { uploadImage } from './suphabase'

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
  console.log(user)
  try {
    const rawData = Object.fromEntries(formData)
    const file = formData.get('image') as File
    const validatedData = validateWithZodSchema(productSchema, rawData)
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
  return await db.product.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}
