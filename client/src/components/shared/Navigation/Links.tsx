"use client"
import { Page } from '@/lib/dal'
import Link from 'next/link'
import React from 'react'

const Links = ({pages}: {pages: Page[]}) => {
  return (
    <ul className='flex items-center gap-6'>
        {pages.map((page, index) => (
            <Link key={index} href={`/${page.slug}`}>{page.title}</Link>
        ))}
    </ul>
  )
}

export default Links