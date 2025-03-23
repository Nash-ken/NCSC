"use server"
import { authenticate, createSession, deleteSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { loginSchema, registerSchema } from '../definitions'

export async function login(prev: any, formData: FormData) {
  const stay = formData.get('checkbox') === 'on' // Handle checkbox correctly
  
  // Validate form data against the schema
  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    stay,
  })
  
  if (!validatedFields.success) {
    const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors)
      .flat()
      .map(err => err)

    return { errors: errorMessages }
  }

  const { email, password } = validatedFields.data
  
  try {
    // Call authenticate function to log in the user
    const { access_token, refresh_token, error } = await authenticate(email, password)

    // Check if both tokens exist, if not, return an error response
    if (error || !access_token || !refresh_token) {
      return { isAuth: false, errors: [error || "Authentication failed"] }
    }

    // Always create access_token session
    await createSession('access_token', access_token)

    // Conditionally create refresh_token session if stay is true
    if (stay) {
      await createSession('refresh_token', refresh_token)
    }

    // Return the redirection path after successful authentication
    return { isAuth: true, errors: [] }
    
  } catch (error) {
    return { isAuth: false, errors: ["An unexpected error occurred."] }
  }
}


export async function signup(prev: any, formData: FormData) {
  // Validate form data against the schema
  const validatedFields = registerSchema.safeParse({
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    ConfirmPassword: formData.get('ConfirmPassword'),
  })
  
  if (!validatedFields.success) {
    const errorMessages = Object.values(validatedFields.error.flatten().fieldErrors)
      .flat()
      .map(err => err)

    return { errors: errorMessages }
  }

  const { username, email, password } = validatedFields.data
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password }),
    })
    const result = await response.json()

    if(!result) {
      return { errors: ['Unable to Create Account']}
    }
    
    console.log(result)
  } catch (error: any) {
    console.log(error)
    return { errors: [error]};
  }
}



export const logout = async () => {
  await deleteSession()
  redirect('/login')
}

export const changePassword = async (prev: any, formData: FormData, token: string) => {

  const fields = {
    newPassword: formData.get("password")
  } 

  const { newPassword } = fields;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    });

    // Ensure the response is OK (status code 200)
    if (!response.ok) {
      throw new Error('Invalid or outdated token');
    }

    const result = await response.json();

    // Check if result is falsy or has an error message
    if (!result || result.error) {
      console.log('Error in result:', result?.error || 'Unknown error');
      return { error: result?.error || 'Unknown error' };
    }

    console.log(result.message);
    return { success: result.message };

  } catch (error: any) {
    // Log the error to console and return it
    console.error('Failed to Change Password:', error);
    return { error: error.message || 'An unknown error occurred' };
  }
};


export const resetPassword = async (prev: any, formData: FormData) => {

  const email = formData.get('email')?.toString();

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    // Ensure the response is OK (status code 200)
    if (!response.ok) {
      throw new Error('Could not Send Email.');
    }

    const result = await response.json();

    // Check if result is falsy or has an error message
    if (!result || result.error) {
      console.log('Error in result:', result?.error || 'Unknown error');
      return { error: result?.error || 'Unknown error' };
    }

    console.log(result.message);
    return { success: result.message };

  } catch (error: any) {
    // Log the error to console and return it
    console.error('Failed to Change Password:', error);
    return { error: error.message || 'An unknown error occurred' };
  }
};


