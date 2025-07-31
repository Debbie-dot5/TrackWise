'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { useState } from 'react';
import { signInSchema, SignInFormData } from '@/lib/schema';
import Link from 'next/link';

type SignInFields = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const router = useRouter();
  const [authError, setAuthError] = useState('');

  const onSubmit = async (data: SignInFields) => {
    setAuthError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      router.push('/dashboard');  
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow space-y-6">
      <h2 className="text-2xl font-semibold text-center">Sign In</h2>

      {authError && <p className="text-red-600 text-center">{authError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

      <Link href="/auth/forgot-password">
      <button className='cursor-pointer text-blue-500 hover:underline'>
          ForgotPassword
        </button>
      </Link>
        

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Sign In
        </button>
      </form>

      <p className="text-center text-sm text-gray-600">
        Don’t have an account?{' '}
        <a href="/signup" className="text-blue-500 hover:underline">Sign up</a>
      </p>
    </div>
  );
}
