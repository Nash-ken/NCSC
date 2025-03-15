import React from "react";
import User from "./User";
import Links from "./Links";
import { getUser, fetchNavigation } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = async () => {
  const [user, navigation] = await Promise.all([getUser(), fetchNavigation()]);

  return (
    <header className="top-0 w-full max-w-screen-xl mx-auto h-20 flex justify-start items-center px-6">
      <div>{navigation.logo}</div>
      <nav className="flex items-center gap-6 mr-auto">
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
