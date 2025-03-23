import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = new Set(['/dashboard'])
const publicRoutes = new Set(['/login', '/signup'])

// Decode JWT and extract expiration time once
function decodeJWT(token: string): { exp?: number } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payloadJson = Buffer.from(base64, 'base64').toString();
    return JSON.parse(payloadJson);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

function getExpirationFromJWT(token: string): number | null {
  const payload = decodeJWT(token);
  return payload?.exp ?? null;
}

async function refreshAccessToken(refreshToken: string) {
  const refreshUrl = 'http://localhost:1337/api/auth/refresh';
  const response = await fetch(refreshUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  return data.access_token;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access_token = req.cookies.get('access_token')?.value;
  const refresh_token = req.cookies.get('refresh_token')?.value;
  const now = Math.floor(Date.now() / 1000);

  const isProtectedRoute = protectedRoutes.has(pathname);

  if (isProtectedRoute) {
    // Only check and refresh the token if the user is accessing a protected route
    if (access_token) {
      const exp = getExpirationFromJWT(access_token);

      if (exp && exp > now) {
        // Token is valid
        return NextResponse.next();
      }

      // Token expired or invalid, try refresh
      if (refresh_token) {
        const newAccessToken = await refreshAccessToken(refresh_token);

        if (newAccessToken) {
          const newExp = getExpirationFromJWT(newAccessToken);
          const maxAge = newExp ? newExp - now : 60 * 15;

          const response = NextResponse.next();
          response.cookies.set('access_token', newAccessToken, {
            httpOnly: true,
            secure: req.nextUrl.protocol === 'https:',
            path: '/',
            sameSite: 'lax',
            maxAge,
          });

          return response;
        }
      }

      // Failed to refresh, redirect to login
      return NextResponse.redirect(new URL('/login', req.nextUrl));
    }

    // No access token at all
    if (refresh_token) {
      const newAccessToken = await refreshAccessToken(refresh_token);

      if (newAccessToken) {
        const newExp = getExpirationFromJWT(newAccessToken);
        const maxAge = newExp ? newExp - now : 60 * 15;

        const response = NextResponse.next();
        response.cookies.set('access_token', newAccessToken, {
          httpOnly: true,
          secure: req.nextUrl.protocol === 'https:',
          path: '/',
          sameSite: 'lax',
          maxAge,
        });

        return response;
      }
    }

    // No tokens, redirect to login if accessing a protected route
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // If accessing a public route, don't check the access token
  if (publicRoutes.has(pathname)) {
    return NextResponse.next();
  }

  // Fallback: handle any other routes as needed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
