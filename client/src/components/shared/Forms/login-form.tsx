"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { login } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React, { useActionState } from 'react'

const LoginForm = () => {

    const [state, action, pending] = useActionState(async (previous: any, formData: FormData) => {
       const user = await login(previous, formData);
       if(user.error) {
        console.log(user.error)
       }
       if(user.success) {
        redirect('/dashboard')
       }
       
    }, undefined)

  return (

    
    <Form action={action}>
       <Card className="w-[350px] border-background md:border-border">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email and password</CardDescription>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        <Input type='email' name='email' placeholder='Email' />
        <Input type='password' name='password' placeholder='Password' />
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
  
    {/* Separator */}
    <div className="border-b border-border h-0.5 w-full mt-8 bg-border"></div>
  
    {/* Sign Up Link */}
    <div className="flex items-center text-muted-foreground text-center justify-center gap-1 mt-4">
      <p className="text-sm">Don't have an account?</p>
      <Link href="/register" className="underline text-foreground">Sign Up</Link>
    </div>
      </CardFooter>
    </Card>
  
   
  </Form>
  
  )
}

export default LoginForm