import { FeaturedType } from "@/lib/dal";

const Featured: React.FC<FeaturedType> = ({ heading, subheading, description, }) => {
    return (
      <section className="container h-full flex flex-col items-center gap-10 pb-10 pt-20 sm:gap-14 lg:flex-row">
        <div className="flex flex-col gap-3 justify-center items-center w-full">
            <span className="font-bold uppercase text-primary text-center">{subheading}</span>
            <h2 className="font-heading text-3xl font-semibold sm:text-4xl text-center">{heading}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl text-center">{description}</p>
        </div>
      </section>
    );
  };
  
  export default Featured;