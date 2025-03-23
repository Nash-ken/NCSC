import { Button } from '@/components/ui/button'
import { CircleX } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
  return (
    <div className='mx-auto w-full max-w-screen-xl px-3 py-3 flex flex-col items-center justify-center flex-1'>
        <div className='flex flex-col items-center gap-3'>
            <CircleX className=' animate-pulse text-destructive' />
            <p className='text-destructive animate-pulse font-semibold'>Page Not Found</p>
        </div>
        <Button variant={"link"} className='underline' asChild><Link href={`${process.env.NEXT_PUBLIC_CLIENT_URL}`}>Return to Home Page</Link></Button>
    </div>
  )
}

export default NotFound