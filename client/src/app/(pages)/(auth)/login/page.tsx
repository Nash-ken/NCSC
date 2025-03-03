"use client"

import { Button } from '@/components/ui/button'
import { login } from '@/lib/auth'
import React, { useActionState } from 'react'
import { Loader2 } from "lucide-react";
import Form from 'next/form'
import { redirect } from 'next/navigation';

const LoginPage = () => {
    const [state, action, pending] = useActionState(async () => {
        await login()
        redirect('/dashboard')
    }, undefined)
  return (
    <div className='flex-1 grid place-items-center'>
        <Form action={action}>
            <Button>
                { pending ? (<div className='inline-flex items-center gap-3'><Loader2 className='animate-spin' />Loading</div>) : (<p>Login</p>)}
            </Button>
        </Form>
        
    </div>
  )
}

export default LoginPage