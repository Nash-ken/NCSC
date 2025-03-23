"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { redirect, useSearchParams } from "next/navigation"
import { startTransition, useActionState, useState } from "react"
import { changePassword, logout } from "@/lib/actions/auth"
import { toast } from "sonner"

export function NewPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const [searchParams] = useSearchParams();
    const token = searchParams[1]; // Access the 'token' query parameter
    // State for password and confirmation
    const [ state, action, pending ] = useActionState( async (prev: any, formData: FormData) => {
       
       const response = await changePassword(prev, formData, token)
       if(response.error) {
        toast.error(response.error)
        return;
       }
       if(response.success) {
        toast.success(response.success)
        await startTransition(logout)
       }
    }, undefined)

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden w-full max-w-96 mx-auto bg-background p-0">
                <CardContent>
                    <form
                        className="p-6 md:p-8"
                        action={action}
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold">New Password</h1>
                                <p className="text-balance text-muted-foreground mt-3">
                                    Enter new Password
                                </p>
                            </div>
                            <div className="grid gap-2">
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="New password"
                                />
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                />
                            </div>
                           
                          
                            <Button type="submit" className="w-full flex items-center gap-1">
                                {pending ? (
                                    <div className="flex items-center gap-1">
                                        <Loader2 className="animate-spin" />
                                    </div>
                                ) : (
                                    <p>Reset Password</p>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
