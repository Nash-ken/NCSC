// app/reset/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ResetForm } from '@/components/shared/forms/reset-form';

export default function ResetEmailPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send email to API route to trigger email with resetToken
    const res = await fetch('/api/request-password-reset', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      // Simulate token for demo; in real life, the user would receive a link via email
      const fakeToken = 'demo123token';
      router.push(`/reset/password?token=${fakeToken}`);
    } else {
      // Handle error (e.g., user not found)
      alert('Failed to send reset email.');
    }
  };

  return (
        <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
              <ResetForm />
            </div>
        </div>
  );
}
