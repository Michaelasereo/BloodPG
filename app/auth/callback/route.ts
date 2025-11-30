import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  let next = requestUrl.searchParams.get('next') || '/';

  if (code) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    await supabase.auth.exchangeCodeForSession(code);

    // If redirecting to /admin, verify the user is actually an admin
    if (next === '/admin') {
      const { data: { user } } = await supabase.auth.getUser();
      const ADMIN_EMAIL = 'asereopeyemimichael@gmail.com';
      
      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        // Not admin, redirect to home instead
        next = '/';
      }
    }
  }

  // Redirect to the app after successful authentication
  return NextResponse.redirect(new URL(next, requestUrl.origin));
}

