import React from "react";
import User from "./User";
import Links from "./Links";
import { getUser, fetchNavigation } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Header = async () => {
  const [user, navigation] = await Promise.all([getUser(), fetchNavigation()]);

  return (
    <header className="top-0 w-full max-w-screen-xl mx-auto h-20 flex justify-start items-center px-6">
      <Link href={"/"}><Image src={process.env.NEXT_PUBLIC_API_URL+navigation.logo?.url} alt="Logo" width={80} height={25} /></Link>
      <nav className="flex items-center gap-6 mr-auto ml-6">
        <Links pages={navigation.pages} />
      </nav>
      {user?.role ? (
          <User user={user} pages={navigation.pages} />
        ) : (
          navigation.buttons.map((button) => (
            <Button variant={button.variant} asChild><Link href={button.href}>{button.label}</Link></Button>
          ))
        )}
    </header>
  );
};

export default Header;
