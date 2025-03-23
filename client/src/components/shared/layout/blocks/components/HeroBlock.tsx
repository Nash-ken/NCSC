// components/HeroBlock.tsx
import React from 'react';
import Image from 'next/image';
import { Button as ButtonType, Image as MediaImage } from '@/lib/types';
import { HeartHandshake, ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface HeroBlockProps {
  heading: string;
  subheading: string;
  description: string;
  buttons: ButtonType[];
  cover: MediaImage | null;
}

const HeroBlockComponent = ({
  heading,
  subheading,
  description,
  buttons,
  cover,
}: HeroBlockProps) => (
  <div className="relative w-full h-full text-white py-12">
    
    <div className="z-10 max-w-screen-xl mx-auto px-6 text-center pt-12 md:pt-24">
      <h1 className=" bg-primary/5 border border-border rounded-full w-fit px-3 py-1.5 text-sm mx-auto">{heading}</h1>
      <h2 className="text-4xl max-w-screen-md mt-2 mx-auto">{subheading}</h2>
      <p className="text-lg mt-4 text-muted-foreground">{description}</p>

      {buttons.length > 0 && (
        <div className="mt-6 flex gap-3 w-fit mx-auto">
          {buttons.map((button, index) => (
            <Button variant={button.variant} key={index} asChild>
                <Link href={button.href}>{button.label}</Link>
            </Button>
          ))}
        </div>
      )}
    <div className="relative mt-6 grid place-items-center border border-border rounded-xl overflow-hidden mx-auto w-full h-full min-h-[250px] max-w-[500px] max-h-[250px]">
        {cover && cover.url ? (
            <Image
            className='mx-auto'
            src={process.env.NEXT_PUBLIC_STRAPI_URL + cover.url}
            alt="Hero Cover"
            width={250}
            height={150}
            objectFit="cover" // Prevent stretching by preserving aspect ratio
            // Optional: to add rounded corners or other styles
            />
        ): (
            <div>
                <ImageIcon className=' animate-pulse text-muted' />
            </div>
        )}
    </div>


    </div>
  </div>
);

export default HeroBlockComponent;
