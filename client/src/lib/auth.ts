"use server"
import { authenticate, createSession, deleteSession, isAuthError } from '@/lib/session'
import { redirect } from 'next/navigation';
 
export async function login(formState: any, formData: FormData) {

  const { email , password } = {
    email: formData.get('email') as string,
    password: formData.get('password') as string
  }
  // Previous steps:
  // 1. Validate form fields
  // 2. Prepare data for insertion into database
  // 3. Insert the user into the database or call an Library API
  const auth = await authenticate(email, password);
  if(isAuthError(auth)) return {error: auth.error}
  
  const { jwt } = auth;

  await createSession(jwt)
  return { success: true }
}

//////////////////////////////////////////////////////////////////////////////////

export const logout = async () => {
    await deleteSession()
    redirect('/login')
}