// components/BlogBlock.tsx
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogItem } from '../types';
import { ImageIcon } from 'lucide-react';

interface BlogBlockProps {
  blogs: BlogItem[];
}

const BlogBlockComponent = ({ blogs }: BlogBlockProps) => (
  <div className='w-full max-w-screen-xl mx-auto grid md:grid-cols-3 gap-3'>
   {blogs.map((blog, index) => (
    <Card className='bg-transparent border-0' key={index}>
        <CardHeader>
            <div className='border-border border rounded-xl h-48 grid place-items-center'><ImageIcon className=' animate-pulse text-muted' /></div>
        </CardHeader>
        <CardTitle className='px-12'>{blog.title}</CardTitle>
        <CardDescription className='px-12'>{blog.description}</CardDescription>
        <CardFooter className='text-sm text-muted-foreground px-12'><p className='px-3 py-1.5 borer-border border rounded-full'>{blog.date}</p></CardFooter>
    </Card>
    
   ))}
  </div>
);

export default BlogBlockComponent;
