"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { signup } from "@/lib/actions/auth"
import { toast } from "sonner"
import { redirect } from "next/navigation"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [password, setPassword] = useState("")
  const [strength, setStrength] = useState(0)

  const calculateStrength = (pwd: string) => {
    let score = 0
    if (pwd.length > 8) score += 1
    if (/[A-Z]/.test(pwd)) score += 1
    if (/[0-9]/.test(pwd)) score += 1
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1
    return score
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    const score = calculateStrength(value)
    setStrength((score / 4) * 100) // convert score to percent
  }

  const [state, action, pending] = useActionState(async (prevState: any, formData: FormData) => {
    const newUser = await signup(prevState, formData)
    if(newUser?.errors) {
        toast.error(
            newUser.errors.map((error, index) => (
                <p key={index}>{error}</p>
            ))
        )
    }
    else {
        toast.success("User Created Successfully")
        redirect('/login')
    }

  }, undefined)

  const strengthLabel = strength < 40 ? "Weak" : strength < 80 ? "Medium" : "Strong"
  const strengthColor =
  strength === 0 ? "bg-muted" :
  strength < 40 ? "bg-red-400" :
  strength < 80 ? "bg-amber-400" :
  "bg-emerald-400";

  return (
    <div className={cn("flex w-full pb-0 max-w-96 mx-auto flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden bg-background">
        <CardContent className="p-0">
          <form className="p-6 md:p-8 md:py-0" action={action}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Sign Up</h1>
                <p className="text-balance text-muted-foreground">
                  Create an Account
                </p>
              </div>

              {/* Username Input */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="username" className="text-left">Username</Label>
                <Input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Enter your username"
                />
              </div>

              {/* Email Input */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="email" className="text-left">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="example@example.com"
                />
              </div>

              {/* Password Input + Strength Meter */}
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="password" className="text-left">Password</Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <Progress value={strength} className={`h-2 ${strengthColor}`} />
                <p className="text-xs text-muted-foreground">
                  Password strength: {strengthLabel}
                </p>
              </div>

              {/* Confirm Password Input */}
              <div className="grid w-full max-w-sm items-center gap-1.5 mt-2">
                <Label htmlFor="ConfirmPassword" className="text-left">Confirm Password</Label>
                <Input
                  id="ConfirmPassword"
                  type="password"
                  name="ConfirmPassword"
                  placeholder="Re-enter your password"
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full flex items-center gap-1 mt-4">
                {pending ? (
                  <div className="flex items-center gap-1">
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <p>Sign Up</p>
                )}
              </Button>

              {/* Link to login page */}
              <div className="text-center text-sm my-3">
                Already have an account?{" "}
                <Link href="login" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Terms of Service and Privacy Policy links */}
      <div className="text-balance text-center text-xs text-muted-foreground mt-4 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <Link href="legal">Terms of Service</Link> and{" "}
        <Link href="legal">Privacy Policy</Link>.
      </div>
    </div>
  )
}
