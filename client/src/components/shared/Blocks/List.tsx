import { Card, CardContent } from "@/components/ui/card";
import { ListType } from "@/lib/dal";

const List: React.FC<ListType> = ({ cards }) => {

    return (
      <section className="container h-full flex flex-col items-center gap-10 pb-10  sm:gap-14 lg:flex-row">
      <div className={`grid grid-cols-1 gap-3 w-full ${cards.length === 2 ? "md:grid-cols-2" :cards.length === 3 ? "md:grid-cols-3": "" }`}>
            {cards.map((card, index) => (
                <Card key={index} className="h-full">
                    <CardContent className="h-full">
                        <h4 className="text-lg font-semibold text-center">{card.title}</h4>
                        <p className="mt-3 text-muted-foreground text-center">{card.description}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      </section>
    );
  };
  
  export default List;