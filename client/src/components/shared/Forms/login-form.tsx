"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useActionState } from 'react'
import { toast } from 'sonner'

const LoginForm = () => {

    const [state, action, pending] = useActionState(async (previous: any, formData: FormData) => {
       const auth = await login(previous, formData);
       if(auth.errors) {
        auth.errors.map((error) => {
          toast.error(error)
        })
       

       }
       if(auth.success) {
        toast.success(`Welcome ${auth.user.username}!`)
        redirect('/dashboard')
       }
       
    }, undefined)

  return (

    
    <Form action={action}>
       <Card className="w-[350px] border-background md:border-border">
      <CardHeader>
        <CardTitle className='text-2xl font-semibold tracking-tight text-center'>Login to your account</CardTitle>
        <CardDescription className='text-center'>Enter your email and password</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <Input name='email' placeholder='name@example.com' />
        <Input type='password' name='password' placeholder='Password' />

        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
              <Checkbox id="stay-logged-in" name="stay-logged-in" />
              <Label htmlFor="stay-logged-in" className="text-sm">Stay logged in</Label>
            </div>

            {/* Forgot Password Link */}
            <div className="mt-2 text-right">
              <Link href="/reset" className="text-sm text-primary underline">Forgot Password?</Link>
            </div>
        </div>

       
      </CardContent>
      <CardFooter className="flex flex-col">
         {/* Submit Button */}
    <Button className="w-full py-3">
      {pending ? (
        <div className="inline-flex items-center gap-3">
          <Loader2 className="animate-spin" /> Loading...
        </div>
      ) : (
        "Login"
      )}
    </Button>
  
  
    {/* Sign Up Link */}
    <div className="flex items-center text-muted-foreground text-center justify-center gap-1 mt-4">
      <p className="text-sm">Don't have an account?</p>
      <Link href="/register" className="underline text-foreground text-sm">Sign Up</Link>
    </div>
      </CardFooter>
    </Card>
  
   
  </Form>
  
  )
}

export default LoginForm