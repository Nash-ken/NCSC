import { fetchPage } from '@/lib/dal';
import { notFound } from 'next/navigation';
import React from 'react'

const Page = async ({params}: {params: Promise<{slug: string}>}) => {
  const { slug } = await params;

  const page = await fetchPage(slug)

  if(!page) {
    notFound();
  }

  return (
    <p>{page.title}</p>
  )
}

export default Page