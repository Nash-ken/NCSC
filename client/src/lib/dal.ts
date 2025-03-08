import 'server-only'
 
import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { cache } from 'react'
import { strapi } from './api'
 
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

    try {
      const response = await fetch(`${strapi.baseURL}/users/${decoded.id}`, {
        headers: { Authorization: `Bearer ${strapi.auth}` }
      });
      
      if(!response.ok) return null

      const data = await response.json()

      return data as User;

    } catch (error) {
      
    }
  })


  //////////////////////////////////////////////////////////////

  export type User = {
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

  /////////////////////////////////////////////////////////////


  export type Page = {
    title: string;
    slug: string;
  }


  export const fetchPages = async (): Promise<Page[]> => {
    try {
      const response = await fetch(`${strapi.baseURL}/pages/fetch-all`);
  
      // If the response is not successful (status code other than 2xx), handle it
      if (!response.ok) {
        console.error("Failed to fetch pages:", response.statusText);
        return [];
      }
  
      const result: Page[] | null = await response.json();
  
      // If result is null or undefined, return an empty array
      if (!result) {
        return [];
      }
  
      return result;
    } catch (error) {
      // Log the error and return an empty array in case of any failure
      console.error("Error fetching pages:", error);
      return [];
    }
};

export const fetchPage = async (slug: string) => {
  try {
    const response = await fetch(`${strapi.baseURL}/pages/${slug}`)

    if(!response.ok) {
      return null;
    }

    const result = await response.json();

    if(!result) return null

    return result as Page
  } catch (error) {
    console.error("Error fetching pages:", error);
    return null
  }
}
  