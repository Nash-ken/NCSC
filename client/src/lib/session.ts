import "server-only"
import { JWTPayload, SignJWT, jwtVerify } from "jose"
import { cookies, headers } from "next/headers"

const secretKey = process.env.JWT_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

async function isSecureRequest() {
  const proto = (await headers()).get('x-forwarded-proto')
  return proto === 'https'
}

function getExpirationFromJWT(token: string): number | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    return payload.exp || null
  } catch (error) {
    console.error("Failed to decode JWT:", error)
    return null
  }
}


export async function decrypt(session: string | undefined = '') {
  if (!session) {
    console.log('No session provided');
    return null;  // Return null if no session is provided
  }

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });

    return payload;  // Return the decoded payload if verification is successful
  } catch (error) {
    console.error('Failed to verify session:', error);  // Log the actual error message
    return null;  // Return null in case of verification failure
  }
}


// Encrypt method remains the same
export async function encrypt(payload: JWTPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function createSession(sessionName: string, token: string) {
 
  const expirationTime = getExpirationFromJWT(token);

  if (!expirationTime) {
    console.error('Invalid or expired token');
    return;  // Handle this appropriately, possibly returning or throwing an error
  }

  const expiresAt = new Date(expirationTime * 1000);  // Convert exp from seconds to milliseconds

  // Calculate the maxAge (in seconds) from the expiration date of the JWT
  const maxAge = Math.floor((expiresAt.getTime() - Date.now()) / 1000);  // Convert milliseconds to seconds

  const cookieStore = await cookies();
  const secure = await isSecureRequest();

  cookieStore.set(sessionName, token, {
    httpOnly: true,
    secure,
    maxAge,  // Set maxAge directly from the calculated value
    sameSite: 'lax',
    path: '/',
  });
}


// Update Session Logic
export async function updateSession() {
  const refreshToken = (await cookies()).get('refresh_token')?.value
  const secure = await isSecureRequest()

  if (!refreshToken) {
    console.error('No refresh token available')
    return null // If no refresh token is found, return null
  }

  try {
    // Make the request to the refresh API to get a new access token
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      console.error('Failed to Refresh Token:', response.statusText)
      return null
    }

    const data = await response.json()
    const { access_token } = data

    if (!access_token) {
      console.error('No access token received')
      return null
    }

    // Decrypt the new access token to extract the expiration date
    let payload
    try {
      payload = await decrypt(access_token)
    } catch (error) {
      console.error('Failed to decrypt access token:', error)
      return null
    }

    if (!payload?.exp) {
      console.error('No expiration found in access token')
      return null
    }

    // Calculate the expiration date from the token's exp field (in seconds)
    const expiresAt = new Date(payload.exp * 1000) // Convert seconds to milliseconds

    // Update the cookie with the new access token
    const cookieStore = await cookies()
    cookieStore.set('access_token', access_token, {
      httpOnly: true,
      secure,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    })

    // Return the newly refreshed access token
    return access_token
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete('access_token')
  cookieStore.delete('refresh_token')
}

export async function authenticate(identifier: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, password }),
  })

  if (!response.ok) {
    const { error } = await response.json()
    console.error('Failed to authenticate:', error.message)
    return { access_token: null, refresh_token: null, error: error.message } // Return null for both tokens
  }

  const data = await response.json() // Await the promise to get the parsed JSON data
  const { access_token, refresh_token } = data

  if (!access_token || !refresh_token) {
    return { access_token: null, refresh_token: null }
  }

  return { access_token, refresh_token }
}

export function getExpirationFromStrapiToken(token: string): Date | null {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    if (payload.exp) {
      return new Date(payload.exp * 1000) // Convert seconds to milliseconds
    }
    return null
  } catch (error) {
    console.error('Failed to decode Strapi JWT:', error)
    return null
  }
}

export async function register(username: string, email: string, password: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })

    if (!response.ok) return { errors: 'Check your details again' }

    return await response.json()
  } catch (error) {
    return { errors: error }
  }
}
