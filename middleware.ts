import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/products(.*)',
  '/about',
  '/sign-in',
  '/sign-up',
])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Allow public routes to be accessed without authentication
  if (isPublicRoute(req)) {
    return NextResponse.next()
  }

  const { userId } = await auth()

  // Check admin routes
  if (isAdminRoute(req)) {
    const isAdminUser =  userId === process.env.ADMIN_USER_ID
    if (!isAdminUser) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // For protected routes, ensure user is authenticated
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
