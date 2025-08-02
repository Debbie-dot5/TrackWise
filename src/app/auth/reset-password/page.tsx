'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/utils/supabaseClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { Eye, EyeOff } from 'lucide-react';
const schema = z.object({
  password: z.string().min(6),
});

type Fields = z.infer<typeof schema>;

export default function UpdatePasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Fields>({ resolver: zodResolver(schema) });

  const [msg, setMsg] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const onSubmit = async (data: Fields) => {
    const { error } = await supabase.auth.updateUser({ password: data.password });

    if (error) {
      setMsg('Error resetting password. Try again.');
    } else {
      setMsg('Password updated! Redirecting...');
      setTimeout(() => router.push('/auth/signin'), 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-zinc-950 to-zinc-700 p-4">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader className="text-center relative">
          <CardTitle className="text-3xl font-bold text-foreground mt-4">Set New Password 🔒</CardTitle>
           
          <CardDescription className="text-muted-foreground">
             Enter your new secret code to secure your account.
          </CardDescription>
        </CardHeader>

        <CardContent className='space-y-6'>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className='space-y-2'>
          <Label htmlFor="password" className="block text-sm font-medium">New Password</Label>
          <div className='relative'>
          <Input
            id="password"
            type={showNewPassword ? "text" : "password"}
            {...register('password')}
              className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200 ease-in-out pr-10"
          />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showNewPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                 {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>
        </div>


         <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-foreground font-medium">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Type it again to confirm! "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200 ease-in-out pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Update Password
        </button>
      </form>

       {/* )}
          {message && (
            <div className={`mt-4 text-center text-sm ${isTokenValid ? "text-primary" : "text-destructive"}`}>
              {message}
            </div>
          )}
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/login" className="underline text-primary hover:text-vibrant-pink font-medium">
              Back to Login
            </Link>
          </div> */}

      {msg && <p className="text-center text-green-600">{msg}</p>}

        </CardContent>
      </Card>

    </div>
  );
}
