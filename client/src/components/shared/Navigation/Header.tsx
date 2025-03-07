import React from 'react'
import User from './User'
import { getUser } from '@/lib/dal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Header = async () => {
  const user = await getUser()
  return (
    <header className='top-0 w-full max-w-screen-xl mx-auto sticky h-20 flex items-center justify-between px-6'>
        <div>Logo</div>

        <nav className='flex items-center gap-6'>
          <ul>
            List
          </ul>

          {user ? (
           <User user={user} />
        ) :(
          <Button asChild><Link href={"/login"}>Login</Link></Button>
        )}
        </nav>
       
       
    </header>
  )
}

export default Header