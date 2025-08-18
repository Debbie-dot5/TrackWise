"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function VerifyingPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        // Redirect straight to onboarding once logged in
        router.push("/onboarding");
      } else {
        // Give it a couple seconds in case of delay
        setTimeout(() => {
          router.push("/auth/error");
        }, 3000);
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
      <p className="text-gray-600">Hang tight! We’re getting things ready for you.</p>
    </div>
  );
}
