import React from "react";
import User from "./User";
import Links from "./Links";
import { getUser, fetchPages } from "@/lib/dal";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = async () => {
  const [user, pages] = await Promise.all([getUser(), fetchPages()]);

  return (
    <header className="sticky top-0 w-full max-w-screen-xl mx-auto h-20 flex items-center justify-between px-6">
      <div>Logo</div>
      <nav className="flex items-center gap-6">
        <Links pages={pages} />
        {user ? (
          <User user={user} pages={pages} />
        ) : (
          <Button variant={"ghost"} asChild>
            <Link href="/login">Login</Link>
          </Button>
        )}
      </nav>
    </header>
  );
};

export default Header;
