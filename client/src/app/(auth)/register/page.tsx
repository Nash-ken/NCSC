import { RegisterForm } from '@/components/shared/forms/register-form'
import React from 'react'

const RegisterPage = () => {
  return (
     <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <RegisterForm />
        </div>
      </div>
  )
}

export default RegisterPage