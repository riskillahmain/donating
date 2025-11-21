import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname;

  // 1. Define Protected Routes (Halaman yang WAJIB Login)
  // - Dashboard (/)
  // - Analytics (/analytics)
  // - Settings Global (/settings)
  // - Overlay Settings (/overlay/settings/...)
  // - Creator List Admin (/creators) - Asumsi ini halaman admin
  const isProtectedRoute = 
    path === '/' ||
    path.startsWith('/analytics') ||
    path.startsWith('/settings') ||
    path.startsWith('/overlay/settings') ||
    path.startsWith('/creators');

  // 2. Define Guest-Only Routes (Halaman yang TIDAK BOLEH diakses jika sudah Login)
  const isGuestOnlyRoute = 
    path === '/login' || 
    path === '/register' || 
    path === '/forgot-password';

  // LOGIC REDIRECT
  
  // A. Jika user BELUM login, tapi maksa masuk Protected Route -> Tendang ke Login
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // B. Jika user SUDAH login, tapi iseng ke halaman Login/Register -> Balikin ke Dashboard
  if (user && isGuestOnlyRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  // C. Sisanya (Overlay Publik, Profil Username, Assets, API) -> Boleh lewat (Public)
  return supabaseResponse
}
