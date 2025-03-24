import Render from '@/components/shared/layout/blocks/Render';
import { fetchPage } from '@/lib/actions/page';
import { notFound } from 'next/navigation';
import React from 'react';
import { Metadata } from 'next';




// --- DYNAMIC METADATA ---
export async function generateMetadata({params}: { params: Promise<{ slug: string }>}): Promise<Metadata> {
  const { slug } = await params; // No need to await params, just access directly
  const page = await fetchPage(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: `NCSC | ${page.title || 'Untitled Page'}`, // Fallback title in case page.title is undefined
  };
}

// --- PAGE RENDER ---
const DynamicPage = async ({params}: { params: Promise<{ slug: string }>}) => {
  const { slug } = await params; // No need to await params here either
  const page = await fetchPage(slug);

  if (!page) {
    notFound(); // Navigate to the "not found" page if no page data is found
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
