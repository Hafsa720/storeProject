import db from '@/utils/db';
import { redirect } from 'next/navigation';

export const FetchProducts=async()=>{
 const products=db.product.findMany({
  where:{
   featured:true
  },
  //to specify happening of object
  //select:{
  // name:true
  //}
 })
 return products;
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

export const FetchSingleProduct=async(productId:string)=>{
 const product=await db.product.findUnique({
  where:{
   id:productId
  }
 })
 if(!product) redirect('/products')
  return product
 }

