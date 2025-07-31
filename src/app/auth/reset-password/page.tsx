'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/utils/supabaseClient';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-center">Update Your Password</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium">New Password</label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="w-full border rounded px-3 py-2 mt-1"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Update Password
        </button>
      </form>

      {msg && <p className="text-center text-green-600">{msg}</p>}
    </div>
  );
}
