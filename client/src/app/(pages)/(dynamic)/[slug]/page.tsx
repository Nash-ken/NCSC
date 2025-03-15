import Hero from '@/components/shared/Blocks/Hero';
import { Block, fetchPage } from '@/lib/dal';
import React from 'react'

const Page = async ({params}: {params: Promise<{slug: string}>}) => {
  const { slug } = await params;

  const page = await fetchPage(slug)

  return (
    page.blocks.map((block, index) => {
      return(
      <div className='px-6' key={index}>{RenderBlock(block)}</div> 
    )})
  )
}

export default Page




export const RenderBlock = (block: Block<any>) => {
  switch (block.__component) {
    case 'blocks.hero':
      // Ensure that the block passed is a HeroBlock
      return <Hero {...block}/>;
    
    // Add more cases for other block types
    case 'blocks.featured':
      return <>Featured</>
    
    // Handle unknown or unsupported block types (optional)
    default:
      return <div>Unknown block type</div>;
  }
};