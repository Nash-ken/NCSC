import 'server-only';
import { cookies } from 'next/headers';
import { decrypt, updateSession } from '@/lib/session';
import { cache } from 'react';
import { User } from './types';
import { redirect } from 'next/navigation';

export const verifySession = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  let session = await decrypt(accessToken);

  // If session is invalid or doesn't exist, attempt to update session with refresh token
  if (!session?.id) {
    const refreshToken = cookieStore.get('refresh_token')?.value;
    if (refreshToken) {
      // If refresh_token exists, try to refresh the session
      const newAccessToken = await updateSession();
      if (newAccessToken) {
        // Try decrypting the new access token and check if valid
        session = await decrypt(newAccessToken);
      }
    }
  }

  // If session is still invalid, return null
  if (!session?.id) {
    redirect('/login');
  }

  return { isAuth: true, id: session.id, cookie: accessToken };
});

///////////////////////////////////////////////////////////////////

export const getUser = cache(async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('access_token')?.value;
  if (!accessToken) return null; // No cookie, no user.

  const session = await decrypt(accessToken); // Try to decrypt session.
  if (!session?.id) return null; // No valid session.

  try {
    // Fetch user data if session is valid
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      console.error('Failed to fetch user data', response.status, await response.text());
      return null; // Handle failed fetch response
    }

    const data = await response.json();
    const { id, username, email, role, permissions } = data.user;
    return { id, username, email, role, permissions }; // Return user data if valid.
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null; // Catch network or API errors
  }
});

export const hasAccess = (userPermissions: string | any[], requiredPermission: string) => {
  // Ensure that userPermissions is an array before checking for permission
  if (!Array.isArray(userPermissions)) {
    console.error('Invalid permissions array', userPermissions);
    return false;
  }
  return userPermissions.includes(requiredPermission);
};

// Example usage
export const checkMediaAccess = (user: User) => {
  if (!user) return false;
  const requiredPermission = 'api::media.media.findByFolder'; // You can change this to any media API endpoint
  return hasAccess(user.permissions, requiredPermission);
};

export const checkLogAccess = (user: User) => {
  if (!user) return false;
  const requiredPermission = 'api::log.log.find'; // You can change this to any media API endpoint
  return hasAccess(user.permissions, requiredPermission);
}
