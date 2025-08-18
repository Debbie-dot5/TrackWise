"use client";

import { useEffect } from "react";
import { supabase } from '@/lib/supabase';
import { useRouter } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        clearInterval(interval);
        router.push("/welcome");
      } else if (++attempts > 10) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
      <p className="text-gray-600">Please wait while we verify your email...</p>
    </div>
  );
}

