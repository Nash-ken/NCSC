import { Button } from '@/components/ui/button'
import { Page } from '@/lib/types'
import Link from 'next/link'
import React from 'react'

const Links = ({ pages }: {pages: Page[]}) => {
  return (
    <div className="hidden md:flex items-center gap-3">
          {pages?.map((page, index) => (
            <Button variant={'link'} key={index} asChild><Link href={process.env.NEXT_PUBLIC_CLIENT_URL + "/" + page.slug}>{page.title}</Link></Button>
          ))}
    </div>
  )
}

export default Links