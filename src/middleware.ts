// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // 세션 가져오기
    const { data: { session }, error } = await supabase.auth.getSession()

    // 로그아웃 요청인 경우 세션 클리어
    if (req.nextUrl.pathname === '/api/auth/logout') {
      await supabase.auth.signOut()
      const response = NextResponse.next()
      response.cookies.delete('sb-access-token')
      response.cookies.delete('sb-refresh-token')
      return response
    }

    // 보호된 경로 체크
    const protectedPaths = ['/dashboard', '/matches', '/rankings', '/profile']
    const isProtectedPath = protectedPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    )

    // 세션이 없는데 보호된 경로에 접근하는 경우
    if ((!session || error) && isProtectedPath) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    if (req.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}