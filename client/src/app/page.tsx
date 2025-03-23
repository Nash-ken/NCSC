import Render from "@/components/shared/layout/blocks/Render";
import { fetchPage } from "@/lib/actions/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'NCSC | Home',
  description: 'Welcome',
}

export default async function Home() {
  const home = await fetchPage('home')
  
  if(!home) {
    return (
      <div></div>
    )
  } else {
    return (
        <div>
           {home.blocks.map((block, index) => (
          <Render key={index} render={block} />
         ))}
        </div>
      )
  }

}
