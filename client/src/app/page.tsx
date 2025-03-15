import { fetchPage } from "@/lib/dal";
import { RenderBlock } from "./(pages)/(dynamic)/[slug]/page";

export default async function Home() {
  const page = await fetchPage('home')
  console.log(page)
  return (
    <div className="px-6">
      { page.blocks.map((block, index) => (
        <div key={index}>{RenderBlock(block)}</div>
      )) }
    </div> 
  );
}
