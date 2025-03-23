import { BlogBlock, HeroBlock, KnownBlock, NewsBlock, RichAreaBlock, TitleBlock } from './types'; // Import the block types
import RichBlock from './components/RichBlock'; // Import the component for RichArea
import TitleBlockComponent from './components/TitleBlock'; // Import the component for Title
import { JSX } from 'react';
import NewsBlockComponent from './components/NewsBlock';
import HeroBlockComponent from './components/HeroBlock';
import BlogBlockComponent from './components/BlogBlock';

// Component map that connects each block type with its corresponding React component
const componentMap = {
  'layout.rich-area': (block: RichAreaBlock) => <RichBlock content={block.Content} />,
  'layout.title': (block: TitleBlock) => <TitleBlockComponent heading={block.heading} subheading={block.subheading} background={block.background} />,
  'layout.news': (block: NewsBlock) => <NewsBlockComponent news={block.news} />,
  'layout.hero': (block: HeroBlock) => <HeroBlockComponent heading={block.heading} subheading={block.subheading} description={block.description} buttons={block.buttons} cover={block.cover} />,
  'layout.blog': (block: BlogBlock) => <BlogBlockComponent blogs={block.blogs} />
} as Record<KnownBlock['__component'], (block: KnownBlock) => JSX.Element>;

// BlockRender component responsible for rendering the correct block
const Render = ({ render }: { render: KnownBlock }) => {
    const renderComponent = componentMap[render.__component]

    if (!renderComponent) {
      return <div>Unknown Block</div>; // Fallback in case of an unknown block type
    }
  
    // Render the correct component with the block data
    return renderComponent(render);
};

export default Render;
