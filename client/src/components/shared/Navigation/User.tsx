"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { logout } from "@/lib/auth"
import type { Page, User } from "@/lib/dal"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import Link from "next/link"
import { redirect, usePathname } from "next/navigation"
import { startTransition, useActionState } from "react"

const User = ({user, pages}: {user: User, pages: Page[]}) => {

  const path = usePathname();

    const [state, action, pending] = useActionState( async () => {
        await logout()
        redirect('/login')
    }, undefined);

    // Drawer Avatar - to render the Avatar
  // Drawer Avatar - to render the Avatar
  const DrawerAvatar = () => (
    <Button variant="outline" size={"icon"} className="rounded-full overflow-hidden cursor-pointer">
      <Avatar>
        <AvatarImage width={32} height={32} className="overflow-hidden" src="https://githdsdub.com/shadcn.png" />
        <AvatarFallback className="capitalize">{user.username.slice(0, 1)}</AvatarFallback>
      </Avatar>
    </Button>
  );

  // Drawer Footer - to render the footer of the drawer
  const DrawerFooterSection = () => (
    <DrawerFooter>
       {/* Profile Section */}
    <div className="border border-border p-3 rounded-lg flex items-center gap-3">
      {/* Avatar */}
      <Avatar>
        <AvatarImage width={32} height={32} className="overflow-hidden" src="https://githdsdub.com/shadcn.png" />
        <AvatarFallback className="border-border border size-8 rounded-full grid place-items-center capitalize">{user.username.slice(0, 1)}</AvatarFallback>
      </Avatar>
      {/* Username */}
      <div className="flex flex-col">
        <p className="text-sm font-medium capitalize">{user.username}</p>
        <p className="text-xs text-muted-foreground">Staff</p>
      </div>
      
    </div>

    {/* Logout Button */}
    <DrawerClose asChild>
      <Button variant="outline" onClick={() => startTransition(action)}>Logout</Button>
    </DrawerClose>
    </DrawerFooter>
  );

  // Drawer Content - to render the main content in the drawer
  const DrawerContentSection = () => (
    <DrawerContent style={{ width: 256 }}>
      <DrawerHeader>
        <DrawerTitle><p className="text-muted-foreground text-sm">NCSC CHARITY</p></DrawerTitle>
        <DrawerDescription className="flex flex-col gap-1">
          {pages.map((page, index) => (
            <DrawerClose asChild key={index}>
               <Button variant={path.includes(page.slug) ? "secondary" : "ghost"} className=" justify-start" asChild><Link href={`/${page.slug}`}>{page.title}</Link></Button>
            </DrawerClose>
           
          ))}
        </DrawerDescription>
      </DrawerHeader>
      <DrawerFooterSection />
    </DrawerContent>
  );

  // Main Drawer Component
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        {/* Use a div to trigger the drawer instead of a button */}
        <div className="flex items-center justify-start cursor-pointer">
          <DrawerAvatar />
        </div>
      </DrawerTrigger>
      <DrawerOverlay />
      <DrawerContentSection />
    </Drawer>
  );
};


export default User
