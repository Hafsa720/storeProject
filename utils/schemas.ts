import { z, ZodSchema } from 'zod'

export const productSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'product name must be at least 2 characters long',
    })
    .max(100, {
      message: 'product name must be at most 100 characters long',
    }),
  company: z.string().min(4),
  price: z.coerce.number().int().min(0, {
    message: 'price must be a positive integer',
  }),
  description: z.string().refine(
    (description) => {
      return description.length >= 10 && description.length <= 500
    },
    {
      message: 'description must be between 10 and 500 characters long',
    }
  ),
  featured: z.coerce.boolean().optional().default(false),
})
export const imageSchema = z.object({
  image: validateImageFile(),
})

function validateImageFile() {
  const maxUploadSize = 1024 * 1024
  const acceptedFileTypes = ['image/']
  return z
    .instanceof(File)
    .refine((file) => {
      return !file || file.size <= maxUploadSize
    }, `File size must be less than 1 MB`)
    .refine((file) => {
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      )
    }, 'File must be an image')
}

export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T | { error: string } {
  const result = schema.safeParse(data)
  if (result.success) {
    return result.data
  } else {
    const errorMessage = result.error.issues
      .map((issue) => issue.message)
      .join(', ')
    return { error: errorMessage }
  }
}
export const reviewSchema = z.object({
  productId: z.string().refine((value) => value !== '', {
    message: 'Product ID cannot be empty',
  }),
  authorName: z.string().refine((value) => value !== '', {
    message: 'Author name cannot be empty',
  }),
  authorImageUrl: z.string().refine((value) => value !== '', {
    message: 'Author image URL cannot be empty',
  }),
  rating: z.coerce
    .number()
    .int()
    .min(1, { message: 'Rating must be at least 1' })
    .max(5, { message: 'Rating must be at most 5' }),
  comment: z
    .string()
    .min(10, { message: 'Comment must be at least 10 characters long' })
    .max(1000, { message: 'Comment must be at most 1000 characters long' }),
})
