import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl

  console.log('[middleware] ===== DASHBOARD REQUEST =====', {
    pathname: url.pathname,
    cookies: request.cookies.getAll().map(c => c.name),
  })

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user: Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'] = null
  let userError: { message?: string } | null = null

  try {
    const result = await supabase.auth.getUser()
    user = result.data?.user ?? null
    userError = result.error
  } catch (err) {
    userError = err instanceof Error ? err : new Error(String(err))
  }

  console.log('[middleware] getUser result:', {
    userId: user?.id,
    hasError: !!userError,
    errorMessage: userError?.message ?? null,
  })

  if (userError) {
    console.error('[middleware] getUser error detail:', userError)
  }

  if (!user) {
    console.log('[middleware] ⛔ No user — strict redirect to /')
    return NextResponse.redirect(new URL('/', request.url))
  }

  console.log('[middleware] ✅ Authenticated — rendering dashboard')
  return supabaseResponse
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
