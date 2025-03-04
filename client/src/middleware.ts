import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/session'

const protectedRoutes = new Set(['/dashboard'])
const publicRoutes = new Set(['/login'])

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname

  if (!protectedRoutes.has(path) && !publicRoutes.has(path)) {
    return NextResponse.next() // Exit early for non-protected/public routes
  }

  const sessionCookie = req.cookies.get('session')?.value
  const session = sessionCookie ? await decrypt(sessionCookie) : null // Still need `await`

  if (protectedRoutes.has(path) && !session?.userId) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  if (publicRoutes.has(path) && session?.userId && path !== '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
  }

  return NextResponse.next()
}


// Exclude static and API routes
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
