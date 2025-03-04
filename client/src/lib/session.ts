import 'server-only'
import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { strapi } from './api'
 
const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
 
export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}
 
export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.log('Failed to verify session')
  }
}

 
export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, expiresAt })
    const cookieStore = await cookies()
   
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: 'strict',
      path: '/',
    })
  }


   
  export async function updateSession() {
    const session = (await cookies()).get('session')?.value
    const payload = await decrypt(session)
   
    if (!session || !payload) {
      return null
    }
   
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
   
    const cookieStore = await cookies()
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expires,
      sameSite: 'strict',
      path: '/',
    })
  }



export async function deleteSession() {
    const cookieStore = await cookies()
    cookieStore.delete('session')
}



export const authenticate = async (email: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${strapi.baseURL}/auth/local`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({identifier: email, password: password})
        })

        const result = await response.json()

        if(response.status !== 200 || result.error) {
          return { error: result?.error.message }
        }

        return result;

    } catch (error) {
        return { error: error instanceof Error ? error.message : "Unknown error occurred" };
    }
}

export function isAuthError(response: AuthResponse): response is { error: string} {
    return (response as { error: string}).error !== undefined;
}


type AuthResponse = 
  | {
      jwt: string;
      user: {
        id: number;
        documentId: string;
        username: string;
        email: string;
        provider: string;
        confirmed: boolean;
        blocked: boolean;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
      };
    }
  | { error: string };

