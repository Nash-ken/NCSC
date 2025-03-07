"use server"
import { authenticate, createSession, deleteSession, isAuthError } from '@/lib/session'
import { redirect } from 'next/navigation';
import { loginSchema } from './definitions';
import { z } from 'zod';
 
export async function login(formState: any, formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  });

  if (!validatedFields.success) {
    // Flatten the errors and convert them into a simple array of error messages
    const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors)
      .flat() // Flatten nested error arrays
      .map(err => err); // Each error message as a string

    return { errors: errorMessages };
  }

  const { email, password } = validatedFields.data;

  // 1. Validate form fields
  // Assuming you will use Zod or another validation library here
  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call a Library API


  const auth = await authenticate(email, password);
  
  if (isAuthError(auth)) {
    return { errors: auth.errors };
  }

  const { jwt, user } = auth;

  await createSession(jwt);
  return { success: true, user };
}


//////////////////////////////////////////////////////////////////////////////////

export const logout = async () => {
    await deleteSession()
    redirect('/login')
}