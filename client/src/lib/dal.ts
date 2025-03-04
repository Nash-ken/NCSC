import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { cache } from 'react'
 
export const verifySession = cache(async () => {
  const cookie = (await cookies()).get('session')?.value
  const session = await decrypt(cookie)
 
  if (!session?.userId) {
    return { isAuth: false, userId: '' }
  }
 
  return { isAuth: true, userId: session.userId }
})


export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null
    
    const decoded = await decrypt(`${session.userId}`) as { id: number; iat: number, exp: number}
    if(!decoded) return null
   

   

    return decoded.id
  
  })


  //////////////////////////////////////////////////////////////

  type User = {
    id: number;
    documentId: string;
    username: string;
    email: string;
    provider: "local";
    confirmed: boolean;
    blocked: boolean;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  }