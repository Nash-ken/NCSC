import { getUser } from "@/lib/dal";
import User from "./user";
import { fetchNavigation } from "@/lib/actions/page";
import Links from "./links";
import Buttons from "./buttons";
import Logo from "./logo";


// app/components/shared/layout/navigation/navbar/header.tsx
export default async function Header() {
  const [user, navigation] = await Promise.all([getUser(), fetchNavigation()])

  if(!(user || navigation)) {
    return <div></div>
  } else
  {
    return (
      <header className="w-full h-20 flex items-center px-6">
        <nav className="mx-auto w-full max-w-screen-xl flex">
         
         <Logo image={navigation.logo}/>
          <Links pages={navigation.pages || []} />
          { user ? 
            (<User user={user} pages={navigation.pages} />) 
            : 
            (<Buttons buttons={navigation.buttons} />)
          }
          
        </nav>
      </header>
    );
  }

 
}
