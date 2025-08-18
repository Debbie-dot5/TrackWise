// app/auth/callback/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    try {
      // Exchange the code for a session
      await supabase.auth.exchangeCodeForSession(code);

      // Redirect to a "verifying" page in the browser
      return NextResponse.redirect(new URL("/auth/verifying", request.url));
    } catch (error) {
      console.error("Error exchanging code:", error);
      return NextResponse.redirect(new URL("/auth/error", request.url));
    }
  }

  return NextResponse.redirect(new URL("/auth/error", request.url));
}
