import { Button } from "@/components/ui/button";
import { Block, HeroType } from "@/lib/dal"
import Image from "next/image";
import Link from "next/link";

const Hero: React.FC<HeroType> = ({ header, description, image, buttons }) => {
  return (
    <section className="container h-full flex flex-col items-center gap-10 pb-10 pt-20 sm:gap-14 lg:flex-row">
    <div className="flex flex-1 flex-col items-center gap-8 lg:items-start lg:gap-10">
      <div className="flex items-center gap-1 rounded-full border bg-secondary px-3 py-0.5 hover:bg-secondary/60">
        <span className="text-sm text-secondary-foreground">
          Protecting the Future
        </span>
      </div>
      <h1 className="max-w-2xl text-center font-heading text-4xl font-semibold sm:text-5xl sm:leading-tight lg:text-left">
        {header}
      </h1>
      <p className="max-w-md text-center text-lg text-muted-foreground lg:text-left">
        {description}
      </p>
      <div className="grid grid-cols-2 gap-3">
        {buttons.map((button, index) => (
          <Button key={index} variant={button.variant} size={button.size} asChild><Link href={button.href}>{button.label}</Link></Button>
        ))}
      </div>
    </div>
    <div className="relative flex-1 w-full">
    <Image
          alt="Hero"
          loading="lazy"
          src="/public/file.svg"
          width={500} 
          height={300}
          className="rounded-xl border border-border shadow-lg w-full h-auto md:w-[500px] md:h-[300px]"
          sizes="(max-width: 768px) 100vw, 500px"
        />
      <div className="absolute inset-0 -z-10 bg-primary/20 [filter:blur(90px)]"></div>
    </div>
  </section>
  );
};

export default Hero;