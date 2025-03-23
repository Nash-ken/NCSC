"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { useActionState } from "react"
import { resetPassword } from "@/lib/actions/auth"
import { toast } from "sonner"
import { redirect } from "next/navigation"

export function ResetForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

const [ state, action, pending ] = useActionState(async (prev: any, formData: FormData) => {
    const response = await resetPassword(prev, formData);

    if(response.error) {
        toast.error(response.error)
        return;
    }

    if(response.success) {
        toast.success(response.success)
        redirect('/login')
    }
}, undefined)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden w-full max-w-96 mx-auto bg-background p-0">
        <CardContent>
          <form className="p-6 md:p-8" action={action}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <p className="text-balance text-muted-foreground mt-3">
                  Enter your Email
                </p>
              </div>
              <div className="grid gap-2">
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                />
              </div>
              

              
              <Button type="submit" className="w-full flex items-center gap-1">
                {false ? (<div className="flex items-center gap-1"><Loader2 className=" animate-spin" /></div>) : (<p>Reset Password</p>)}
              </Button>
            
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
