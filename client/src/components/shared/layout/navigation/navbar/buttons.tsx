import { Button } from '@/components/ui/button'
import type { Button as ButtonType } from '@/lib/types'
import Link from 'next/link'
import React from 'react'

const Buttons = ({ buttons }: { buttons: ButtonType[]}) => {
  return (
    <div className="flex items-center gap-3 ml-auto">
          {buttons?.map((button, index) => (
            <Button variant={'outline'} key={index} asChild><Link href={process.env.NEXT_PUBLIC_CLIENT_URL + "/" + button.href}>{button.label}</Link></Button>
          ))}
    </div>
  )
}

export default Buttons