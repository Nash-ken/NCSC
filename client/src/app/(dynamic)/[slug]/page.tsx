import Render from '@/components/shared/layout/blocks/Render';
import { fetchPage } from '@/lib/actions/page';
import { notFound } from 'next/navigation';
import React from 'react';
import { Metadata } from 'next';

type PageParams = {
  params: { slug: string };
};

// --- DYNAMIC METADATA ---
export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchPage(slug);


  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `NCSC | ${page.title}` || 'Untitled Page',
  };
}

// --- PAGE RENDER ---
const DynamicPage = async ({ params }: PageParams) => {
  const { slug } = await params;
  const page = await fetchPage(slug);

  if (!page) {
    notFound();
  }

  const blocks = page.blocks;

  return (
    <div>
      {blocks.map((block, index) => (
        <Render key={index} render={block} />
      ))}
    </div>
  );
};

export default DynamicPage;
