// components/NewsBlock.tsx
import { Card } from '@/components/ui/card';
import { NewsItem } from '../types';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface NewsBlockProps {
  news: NewsItem[];
}

const NewsBlockComponent = ({ news }: NewsBlockProps) => (
  <div className='w-full max-w-screen-xl mx-auto'>
    {news.map((item) => (
      <Card className="bg-background my-4 border-0" key={item.id}>
        <div className="flex md:flex-row flex-col gap-3 items-center h-full">
          {/* Image Section with Fixed Size */}
          <div className="w-full grid place-items-center max-w-96 h-56 border-border border  relative rounded-lg overflow-hidden">
            <ImageIcon className='text-muted animate-pulse' />
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center h-full w-full px-6 md:px-0 md:ml-4">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="text-sm mt-2 text-muted-foreground">{item.description}</p>
            <small className="block text-muted-foreground p-2 rounded-full border border-border w-fit mt-2">
              {new Date(item.date).toLocaleDateString()}
            </small>
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export default NewsBlockComponent;
