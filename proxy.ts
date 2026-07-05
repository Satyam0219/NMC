import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isProtectedPath = path.startsWith('/profile') || path.startsWith('/checkout');
  const isAdminPath = path.startsWith('/admin');
  
  // Get the authorized admin email from environment variables
  const adminEmail = process.env.ADMIN_EMAIL;

  // 1. Kick out logged-out users from regular protected routes
  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Strict Security: Kick out unauthorized users from Admin routes
  if (isAdminPath) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // If the logged-in user is NOT the admin, redirect them to the home page
    if (user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};