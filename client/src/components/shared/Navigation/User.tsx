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
import type { User } from "@/lib/dal"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { redirect } from "next/navigation"
import { startTransition, useActionState } from "react"

const User = ({user}: {user: User}) => {

    const [state, action, pending] = useActionState( async () => {
        await logout()
        redirect('/login')
    }, undefined);

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" size={"icon"} className="rounded-full overflow-hidden cursor-pointer">
        <Avatar>
            <AvatarImage width={32} height={32} className="overflow-hidden" src="https://githdsdub.com/shadcn.png" />
                <AvatarFallback className=" capitalize">{user.username.slice(0,1)}</AvatarFallback>
            </Avatar>
        </Button>
      </DrawerTrigger>
      <DrawerOverlay />
      <DrawerContent style={{ width:256}} >
          <DrawerHeader>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
           
            <DrawerClose asChild>
              <Button variant="outline" onClick={()=> startTransition(action)}>Logout</Button>
            </DrawerClose>
          </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default User