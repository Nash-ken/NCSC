type TitleBlockProps = {
    heading: string;
    subheading: string;
    background: string;
  };
  
  const TitleBlockComponent = ({ heading, subheading, background }: TitleBlockProps) => {
    return (
      <section className={`w-full bg-${background}/25 p-6`}>
        <div className="grid place-items-center my-12">
          <h1 className="font-bold uppercase text-primary text-center">{heading}</h1>
          <h2 className="font-heading text-3xl font-semibold sm:text-4xl text-center">{subheading}</h2>
        </div>
      </section>
    );
  };
  
  export default TitleBlockComponent;
  