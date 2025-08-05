import { type NextRequest } from 'next/server'
import { updateSession } from './src/middleware/auth'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - auth (all auth routes)
     * - test (test page)
     * - api (all API routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|auth|test|api).*)',
  ],
}
