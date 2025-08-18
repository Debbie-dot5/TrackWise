'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ForgotFields, ForgotPasswordSchema } from '@/lib/schema';
import { useAuthStore } from '@/stores/auth-store';



export default function ForgotPasswordPage() {

  const {resetPassword } = useAuthStore();


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFields>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');



  const onSubmit = async (data: ForgotFields) => {
    const result  = await resetPassword(data.email);
    if (result.success) {
      setMessage('Check your email to reset your password 📨');
      
      setErr('');
    } else {
      setErr(result.error || 'An unexpected error occurred');
      setMessage('');
    }
   
  }

  // const onSubmit = async (data: ForgotFields) => {
  //   setMessage('');
  //   setErr('');

  //   const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
  //     redirectTo: `${location.origin}/auth/reset-password`,
  //   });

  //   if (error) {
  //     setErr(error.message);
  //   } else {
  //     setMessage('Check your email to reset your password 📨');
  //   }
  // };

  //shadow-lg rounded-xl bg-card text-card-foreground border border-border

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-dark-purple-bg to-deep-purple-bg p-4">
      <Card className='w-full max-w-md mx-auto shadow-lg rounded-xl bg-card text-card-foreground border border-border'>
        <CardHeader className="text-center relative pt-6">
            <Link href="/auth/signin" className="absolute left-1 top-[-20] text-muted-foreground hover:text-primary">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-5 w-5 " />
                <span className="sr-only">Back to signin</span>
              </Button>
            </Link>
          <CardTitle className="text-3xl font-bold text-foreground mt-2">Forgot Your Password? 🔑</CardTitle>
          <CardDescription className="text-muted-foreground">No worries! Enter your email and we&#39;ll send you a reset link.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your.email@example.com"
            {...register('email')}
            className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200 ease-in-out"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          className="
             w-full py-2 text-lg bg-vibrant-purple cursor-pointer text-primary-foreground rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
        >
          {isSubmitting ? 'Sending...' : 'Reset Password'}
          Reset Password
        </button>
      </form>

      {message && <p className="text-green-600 text-center">{message}</p>}
      {err && <p className="text-red-600 text-center">{err}</p>}

      <div className="mt-4 text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/auth/signin" className="underline text-primary hover:text-vibrant-pink font-medium">
              Sign In
            </Link>
          </div>
        </CardContent>

      </Card>
    </div>
  );
}
