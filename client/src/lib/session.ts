import 'server-only';
import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { cookies, headers } from 'next/headers';
import { strapi } from './api';

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// Helper function to determine if the request is secure (HTTPS)
async function isSecureRequest() {
  const proto = (await headers()).get('x-forwarded-proto');
  return proto === 'https';
}

// Helper function to generate the expiration date (7 days from now)
function getExpirationDate() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
}

// Function to encrypt a payload and return a signed JWT token
export async function encrypt(payload: JWTPayload): Promise<string | null> {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(encodedKey);
  } catch (error) {
    console.error('Error during encryption:', error);
    return null;
  }
}

// Function to decrypt the session and verify the JWT token
export async function decrypt(session: string | undefined = ''): Promise<JWTPayload | null> {
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    console.warn('Failed to verify session:', error);
    return null;
  }
}

// Function to create a new session with a user ID and set the cookie
export async function createSession(userId: string) {
  const expiresAt = getExpirationDate();
  const secure = await isSecureRequest();
  const session = await encrypt({ userId, expiresAt });

  if (!session) return; // Prevent setting a broken session

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure,
    expires: expiresAt,
    sameSite: 'strict',
    path: '/',
  });
}

// Function to update an existing session by refreshing its expiration date
export async function updateSession() {
  const expiresAt = getExpirationDate();
  const secure = await isSecureRequest();
  const session = (await cookies()).get('session')?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null; // Return early if session or payload is invalid
  }

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure,
    expires: expiresAt,
    sameSite: 'strict',
    path: '/',
  });
}

// Function to delete the session cookie
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

// Function to authenticate the user via email and password
export const authenticate = async (email: string, password: string): Promise<AuthResponse> => {
  if (!strapi.baseURL) return { errors: ['API base URL is not configured'] };

  try {
    const response = await fetch(`${strapi.baseURL}/custom/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: email, password }),
    });

    const result = await response.json();
    return response.ok
      ? result
      : { errors: [result?.error?.message || 'Authentication failed'] };
  } catch (error) {
    return { errors: [error instanceof Error ? error.message : 'Unknown error occurred'] };
  }
};


// Function to check if the response from authentication contains errors
export function isAuthError(response: AuthResponse): response is { errors: string[] } {
  // Ensure that the response is of the correct type by checking for the 'errors' property
  return (response as { errors: string[] }).errors !== undefined;
}



// Type definition for authentication response
// Type definition for authentication response with array of errors
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
  | { errors: string[] };  // Changed from error: string to errors: string[]
