"use client";

import { useState, useMemo, useActionState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';
import Form from 'next/form';
import Link from 'next/link';
import { register } from '@/lib/auth';
import { toast } from 'sonner';

// Password strength calculator
const calculatePasswordStrength = (password: string): { score: number; strength: string } => {
  let score = 0;

  // Password length check (minimum 8 characters)
  if (password.length < 6) {
    return { score: 0, strength: 'Weak' };
  }

  // Check for different character types
  if (/[a-z]/.test(password)) score += 25; // Lowercase letter
  if (/[A-Z]/.test(password)) score += 25; // Uppercase letter
  if (/[0-9]/.test(password)) score += 25; // Number
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 25; // Special character

  // Determine strength based on score
  let strength = '';
  if (score <= 25) strength = 'Weak';
  else if (score <= 50) strength = 'Medium';
  else if (score <= 75) strength = 'Good';
  else strength = 'Strong';

  return { score, strength };
};

const RegisterForm = () => {
  const [password, setPassword] = useState<string>('');

  // Use useMemo to avoid recalculating password strength on every render
  const passwordStrength = useMemo(() => calculatePasswordStrength(password), [password]);

  // Handle password input change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword); // Update password state
  };

  // Handle form submission
  const [state, action, pendingSubmit] = useActionState(async (previous: any, formData: FormData) => {
    const newUser = await register(previous, formData);
    if (newUser.errors) {
      console.error(newUser.errors);
      return;
    }
    console.log(newUser.success);
  }, undefined);

  return (
    <Form action={action}>
      <Card className="w-[350px] border-background md:border-border">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your details below</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input name="username" type="text" placeholder="Username" />
          <Input name="email" type="email" placeholder="name@example.com" />
          <Input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Input name="confirmPassword" type="password" placeholder="Confirm Password" />
          <Progress className="h-1.5" value={passwordStrength.score} max={100} />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full py-3" type="submit">
            {pendingSubmit ? (
              <div className="inline-flex items-center gap-3">
                <Loader2 className="animate-spin" /> Registering...
              </div>
            ) : (
              'Sign Up'
            )}
          </Button>
          <div className="flex items-center text-muted-foreground text-center justify-center gap-1 mt-4">
            <p className="text-sm">Already have an account?</p>
            <Link href="/login" className="underline text-foreground text-sm">Login</Link>
          </div>
        </CardFooter>
      </Card>
    </Form>
  );
};

export default RegisterForm;
