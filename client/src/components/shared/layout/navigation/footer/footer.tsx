import { Button } from '@/components/ui/button';
import { fetchFooter } from '@/lib/actions/page'
import Link from 'next/link';
import React from 'react'

const Footer = async () => {

    const footer = await fetchFooter();

    if(!footer) {
        return <div></div>
    }else {
        return (
            <footer className='w-full p-6 border-t border-border'>
                <div className='mx-auto w-fit flex flex-col items-center gap-3'>
                    <div className="flex gap-3">
                        {footer.socials.map((social, index) => (
                            <Button key={index} variant={"outline"} className='rounded-full' size={"icon"} asChild><Link href={social.href}>{social.label}</Link></Button>
                        ))}
                    </div>
        
                    <div className="flex gap-3">
                        {footer.pages.map((page, index) => (
                            <Button key={index} variant={"ghost"} className='rounded-full text-muted-foreground'  asChild><Link href={page.slug}>{page.title}</Link></Button>
                        ))}
                    </div>
        
                    <div className='text-muted-foreground'>{footer.description}</div>
                </div>
            </footer>
          )
    }
  
}

export default Footer