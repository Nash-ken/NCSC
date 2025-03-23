// components/logo.tsx
import { Image as MediaImage } from '@/lib/types';
import Image from 'next/image';
import { HeartHandshake } from 'lucide-react';
import Link from 'next/link';

interface LogoProps {
  image?: MediaImage; // Make it optional if sometimes it's null/undefined
}

const Logo: React.FC<LogoProps> = ({ image }) => {
  return image ? (
    <Image
      className="mr-6"
      loading="lazy"
      src={image.url}
      width={24}
      height={24} // changed from height=2 to 24 for better proportion
      alt="Logo"
    />
  ) : (
    <Link className="flex items-center gap-3 mr-6" href={process.env.NEXT_PUBLIC_CLIENT_URL as string}>
      <HeartHandshake />
      <p className="font-semibold">NCSC</p>
    </Link>
  );
};

export default Logo;
