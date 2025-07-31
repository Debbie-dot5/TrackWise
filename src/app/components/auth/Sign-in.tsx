'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';


import { supabase } from '@/utils/supabaseClient';
import { signInSchema, SignInFormData } from '@/lib/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();
  const [authError, setAuthError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = useCallback(
    async (data: SignInFormData) => {
      setAuthError('');
      setIsLoading(true);

      try {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) {
          setAuthError(error.message);
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        setAuthError('An unexpected error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Card className="w-full max-w-md mx-auto shadow-lg rounded-xl bg-card text-card-foreground border border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">Welcome Back! 👋</CardTitle>
          <CardDescription className="text-muted-foreground">
            Let&#39;s get you logged in and back to managing your money.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {authError && <p className="text-red-600 text-center text-sm">{authError}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register('email')}
                className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200 ease-in-out"
                data-testid="email-input"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1" data-testid="email-error">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Shhh... it's a secret! 🤫"
                  {...register('password')}
                  className="py-2 px-4 rounded-lg border border-border focus:ring-2 focus:ring-primary focus:border-primary bg-input text-foreground placeholder:text-muted-foreground transition-all duration-200 ease-in-out pr-10"
                  data-testid="password-input"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  data-testid="toggle-password"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1" data-testid="password-error">
                  {errors.password.message}
                </p>
              )}
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary hover:text-vibrant-pink font-medium text-right block mt-2"
                data-testid="forgot-password-link"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full py-3 text-lg bg-purple-500 text-primary-foreground rounded-full shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
              disabled={isLoading}
              data-testid="submit-button"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don’t have an account?{' '}
            <Link
              href="/signup"
              className="underline text-primary hover:text-vibrant-pink font-medium"
              data-testid="signup-link"
            >
              Create one
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}