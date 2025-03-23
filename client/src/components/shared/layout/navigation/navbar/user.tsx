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

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { logout } from "@/lib/actions/auth";
import { Page } from "@/lib/types";

const User = ({user, pages = []} : {user: any, pages: Page[]}) => {
  

  const [state, action, pending] = useActionState(async () => {
    await logout();
  }, undefined);

  // If the user state is not null, render the DropdownMenu
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="ml-auto" asChild>
        <Button variant="outline" size="icon" className="rounded-full overflow-hidden cursor-pointer">
          <Avatar>
            <div className="capitalize grid place-items-center w-full h-full">{user.username.slice(0, 1)}</div>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="flex justify-between">
          <span className="text-sm font-medium capitalize">{user.username}</span>
          <span>{user.role}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <div className="flex flex-col md:hidden">
            <DropdownMenuSeparator />
            {pages.map((page, index) => (
                <DropdownMenuItem key={index} asChild>
                    <Link href={page.slug}>{page.title}</Link>
                </DropdownMenuItem>
            ))}
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => startTransition(action)}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default User;
