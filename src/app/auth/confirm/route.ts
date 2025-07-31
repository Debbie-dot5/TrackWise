// import { type EmailOtpType } from '@supabase/supabase-js';
// import { type NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@/utils/supabaseClient';

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const token_hash = searchParams.get('token_hash');
//   const type = searchParams.get('type') as EmailOtpType | null;

//   const redirectTo = request.nextUrl.clone();
//   redirectTo.pathname = '/auth/callback';
//   redirectTo.searchParams.delete('token_hash');
//   redirectTo.searchParams.delete('type');

//   if (token_hash && type) {
//     const supabase = createClient();
//     const { error } = await supabase.auth.verifyOtp({ token_hash, type });

//     if (!error) {
//       redirectTo.searchParams.set('status', 'success');
//       return NextResponse.redirect(redirectTo);
//     }
//   }

//   redirectTo.searchParams.set('status', 'error');
//   return NextResponse.redirect(redirectTo);
// }
