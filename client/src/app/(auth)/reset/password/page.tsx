// app/reset/password/page.tsx
import { NewPasswordForm } from '@/components/shared/forms/new-password';

export default function ResetPasswordPage() {

  return (
        <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <NewPasswordForm />
            </div>
        </div>
  );
}
