import { Button } from "@/components/ui/button";
import { getUser } from "@/lib/dal";

export default async function Home() {
  const user = await getUser();
  console.log(user?.username)
  return (
    <div className="flex-1 grid place-items-center">
     <Button variant={"default"}>Wack</Button>
    </div>
  );
}
