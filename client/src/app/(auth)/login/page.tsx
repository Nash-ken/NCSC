import { LoginForm } from '@/components/shared/forms/login-form'
import React from 'react'

const LoginPage = () => {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 md:p-10">
          <div className="w-full max-w-sm md:max-w-3xl">
            <LoginForm />
          </div>
        </div>
      )
}

export default LoginPage