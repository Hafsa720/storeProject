export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string }>

export type CartItem = {
  productId: string
  image: string
  title: string
  price: string
  amount: number
  company: string
}

export type CartState = {
  cartItems: CartItem[]
  numItemsInCart: number
  cartTotal: number
  shipping: number
  tax: number
  orderTotal: number
}
export type Product = {
  id: string
  name: string
  price: number
  image: string
  company: string
  // Add other fields as needed
}