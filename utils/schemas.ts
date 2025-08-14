import {z,ZodSchema} from 'zod'

export const productSchema = z.object({
  name: z.string().min(2,{
    message: 'product name must be at least 2 characters long',
  }).max(100,{
    message: 'product name must be at most 100 characters long',
  }),
  company: z.string().min(4),
  price: z.coerce.number().int().min(0,{
    message: 'price must be a positive integer',
  }),
  description: z.string().refine((description)=>{
    return description.length >= 10 && description.length <= 500
  },{
   message: 'description must be between 10 and 500 characters long',
  }),
  featured: z.coerce.boolean().optional().default(false),
})
export const imageSchema=z.object({
 image:validateImageFile()
})

function validateImageFile() {
 const maxUploadSize=1024 * 1024
 const acceptedFileTypes=['image/']
 return z.instanceof(File).refine((file)=>{
   return file.size <= maxUploadSize && acceptedFileTypes.includes(file.type)
 }, {
   message: `File must be an image and less than ${maxUploadSize / 1024} KB`,
 })
}


export function validateWithZodSchema<T>(schema: ZodSchema<T>, data: unknown): T | { error: string } {
  const result = schema.safeParse(data)
  if (result.success) {
    return result.data
  } else {
    const errorMessage = result.error.issues.map((issue) => issue.message).join(', ')
    return { error: errorMessage }
  }}
