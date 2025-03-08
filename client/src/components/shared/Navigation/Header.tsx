import React from 'react'
import User from './User'
import { getUser } from '@/lib/dal'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { fetchPages } from '@/lib/dal'
import Links from './Links'

const Header = async () => {
  const user = await getUser()
  const pages = await fetchPages();
  return (
    <header className='top-0 w-full max-w-screen-xl mx-auto sticky h-20 flex items-center justify-between px-6'>
        <div>Logo</div>

        <nav className='flex items-center gap-6'>
         <Links pages={pages} />

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