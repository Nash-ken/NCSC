import { Button } from '@/components/ui/button'
import { login } from '@/lib/auth'
import { Loader2 } from 'lucide-react'
import Form from 'next/form'
import { redirect } from 'next/navigation'
import React, { useActionState } from 'react'

const LoginForm = () => {

    const [state, action, pending] = useActionState(async () => {
        await login()
        redirect('/dashboard')
    }, undefined)

  return (
    <Form action={action}>
        <Button type='submit'>
            { pending ? (<div className='inline-flex items-center gap-3'><Loader2 className='animate-spin' />Loading</div>) : (<p>Login</p>)}
        </Button>
    </Form>
  )
}

export default LoginForm