import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect thesis routes
  if (request.nextUrl.pathname.startsWith('/thesis') || 
      request.nextUrl.pathname.startsWith('/docs') ||
      request.nextUrl.pathname === '/') {
    
    if (!user) {
      // Redirect to login if not authenticated
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/login'
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check thesis access for authenticated users
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile) {
      // Profile not found, redirect to complete profile
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/complete-profile'
      return NextResponse.redirect(redirectUrl)
    }

    // Check specific thesis access
    const { data: hasAccess } = await supabase
      .rpc('has_thesis_access', {
        p_user_id: user.id,
        p_thesis_id: 'after-cognition',
        p_required_level: 'read'
      })

    if (!hasAccess && profile.role !== 'admin') {
      // No access to thesis
      const redirectUrl = request.nextUrl.clone()
      redirectUrl.pathname = '/auth/access-denied'
      return NextResponse.redirect(redirectUrl)
    }

    // Log access
    await supabase.rpc('log_audit_event', {
      p_action: 'access_thesis',
      p_resource_type: 'thesis',
      p_resource_id: 'after-cognition',
      p_details: { path: request.nextUrl.pathname },
      p_ip_address: request.ip || request.headers.get('x-forwarded-for') || null,
      p_user_agent: request.headers.get('user-agent') || null
    })
  }

  return response
}
