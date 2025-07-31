'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/utils/supabaseClient';

const ForgotSchema = z.object({
  email: z.string().email(),
});

type ForgotFields = z.infer<typeof ForgotSchema>;

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFields>({
    resolver: zodResolver(ForgotSchema),
  });

  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');

  const onSubmit = async (data: ForgotFields) => {
    setMessage('');
    setErr('');

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${location.origin}/auth/reset-password`,
    });

    if (error) {
      setErr(error.message);
    } else {
      setMessage('Check your email to reset your password 📨');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-center">Forgot Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Reset Password
        </button>
      </form>

      {message && <p className="text-green-600 text-center">{message}</p>}
      {err && <p className="text-red-600 text-center">{err}</p>}
    </div>
  );
}
