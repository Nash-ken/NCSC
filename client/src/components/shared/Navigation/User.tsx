"use client"

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth";
import type { Page, User } from "@/lib/dal";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { startTransition, useActionState } from "react";

const User = ({ user, pages }: { user: User; pages: Page[] }) => {
  const path = usePathname();

  const [state, action, pending] = useActionState(async () => {
    await logout();
    redirect("/login");
  }, undefined);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full overflow-hidden cursor-pointer">
          <Avatar>
            <AvatarImage
              width={32}
              height={32}
              className="overflow-hidden"
              src="https://githdsdub.com/shadcn.png"
            />
            <AvatarFallback className="capitalize">{user.username.slice(0, 1)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex flex-col items-start">
          <span className="text-sm font-medium capitalize">{user.username}</span>
          <span className="text-xs text-muted-foreground">{user.role.name}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
             <Link href={"/dashboard"}>Dashboard</Link>
          </DropdownMenuItem>
        <DropdownMenuSeparator />
        {pages.map((page, index) => (
          <DropdownMenuItem key={index} asChild>
            <Link href={`/${page.slug}`} className={path.includes(page.slug) ? "font-semibold" : ""}>
              {page.title}
            </Link>
          </DropdownMenuItem>
          ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => startTransition(action)}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default User;