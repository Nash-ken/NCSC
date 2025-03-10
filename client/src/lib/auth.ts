"use server"
import { authenticate, createSession, deleteSession, isAuthError } from '@/lib/session'
import { redirect } from 'next/navigation';
import { loginSchema, registrationSchema } from './definitions';
import { strapi } from './api';
 
export const login = async (formState: any, formData: FormData) => {
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

//////////////////////////////////////////////////////////////////////////////////

export const register = async (formState: any, formData: FormData) => {
  try {
    const validatedFields = registrationSchema.safeParse({
      username: formData.get('username'),
      email: formData.get('email'),
      password: formData.get('password'),
      confirmedPassword: formData.get('confirmPassword'),
    });
  
    if (!validatedFields.success) {
      // Flatten the errors and convert them into a simple array of error messages
      const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors)
        .flat() // Flatten nested error arrays
        .map(err => err); // Each error message as a string
  
      return { errors: errorMessages };
    }
  
    const { username, email, password } = validatedFields.data;
  
      // Send data to Strapi
      const response = await fetch(`${strapi.baseURL}/auth/local/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
  
      const data = await response.json();
  
      if(!response.ok) {
        return { errors: [data.message] }
      }
  
    return { success: true }
  }catch(error) {
    return { errors: ["Something went wrong"] }
  }
}