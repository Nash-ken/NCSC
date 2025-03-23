"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { startTransition, useActionState, useState } from "react"
import { login } from "@/lib/actions/auth"
import { redirect, useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [stayLoggedIn, setStayLoggedIn] = useState(false);
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStayLoggedIn(e.target.checked); // Access the checked property and update state
  };
  const router = useRouter()
  const [state, action, pending] = useActionState(async (prevState: any, formData: FormData) => {
    
    const auth = await login(prevState, formData)

    if(auth.errors.length > 0) {
      toast.error( 
        auth.errors.map((error, index) => (
          <p key={index}>{error}</p>
        ))
      )
    }

    // Check if login is successful and if redirectTo is provided
    if (auth.isAuth) {
      router.push('/dashboard')
    }

  }, undefined)

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden bg-background">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" action={action}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your NCSC account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="/reset"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" name="password" />
              </div>

              <div className="flex gap-3">
                <Checkbox
                  id="checkbox"
                  name="checkbox"
                  checked={stayLoggedIn}
                  onCheckedChange={() => setStayLoggedIn(!stayLoggedIn)}
                  className="mr-2"
                />
                <Label>Stay Logged in?</Label>
              </div>
              
              <Button type="submit" className="w-full flex items-center gap-1">
                {pending ? (<div className="flex items-center gap-1"><Loader2 className=" animate-spin" /></div>) : (<p>Login</p>)}
              </Button>
            
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="register" className="underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden mr-6 rounded-xl bg-muted md:block">
            <img
              src="/next.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <Link href="legal">Terms of Service</Link>{" "}
        and <Link href="legal">Privacy Policy</Link>.
      </div>
    </div>
  )
}
