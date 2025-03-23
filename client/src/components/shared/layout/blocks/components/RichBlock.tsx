"use client"
import { cn } from '@/lib/utils';
import { BlocksContent, BlocksRenderer } from '@strapi/blocks-react-renderer';
import { JSX } from 'react';



const RichBlock = ({ content }: { content: BlocksContent}) => {
  return (
    <div className='w-full max-w-screen-xl mx-auto p-6'>
       <BlocksRenderer 
    content={content}
    blocks={{
      paragraph: ({ children }) => (
        <p>{children}</p>
      ),
      heading: ({ children, level }) => {
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        const sizes = {
          1: 'text-3xl',
          2: 'text-2xl',
          3: 'text-xl',
          4: 'text-lg',
          5: 'text-base',
          6: 'text-sm',
        };
        const align = {
          1: 'text-center',
          2: 'text-start',
          3: 'text-start',
          4: 'text-start',
          5: 'text-start',
          6: 'text-start',
        }
        return (
            <Tag className={cn("font-bold mt-6 mb-3", sizes[level], align[level])}>
              {children}
            </Tag>
          );
      },
      list: ({ children, format }) => {
        const listClass = format === 'ordered' ? 'list-decimal' : 'list-disc';
        return (
          <div className="mb-4">
            <ul className={`${listClass} pl-6`}>{children}</ul>
          </div>
        );
      },
      quote: ({ children }) => (
        <blockquote className="border-l-4 border-border pl-4 italic text-muted-foreground bg-muted rounded-md p-2 my-4">
          {children}
        </blockquote>
      ),
      code: ({ children }) => (
        <code>
          {children}
        </code>
      ),
      link: ({ children, url }) => (
        <a href={url}>
          {children}
        </a>
      ),
    }}
  />
    </div>
  );
};

export default RichBlock;