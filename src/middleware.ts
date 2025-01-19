import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // 세션 가져오기 전에 세션 새로고침 시도
    await supabase.auth.getSession()
    const { data: { session }, error } = await supabase.auth.getSession()
    
    console.log('Middleware - Current Path:', req.nextUrl.pathname)
    console.log('Middleware - Session:', session)
    console.log('Middleware - Error:', error)

    // 인증이 필요한 경로들
    const protectedPaths = ['/dashboard', '/matches', '/rankings', '/profile']
    const isProtectedPath = protectedPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    )

    // 인증 페이지들
    const authPaths = ['/login', '/register']
    const isAuthPath = authPaths.some(path => 
      req.nextUrl.pathname.startsWith(path)
    )

    // 세션이 없거나 에러가 있는 경우 보호된 경로 접근 차단
    if ((!session || error) && isProtectedPath) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // 세션이 있는 경우 인증 페이지 접근 차단
    if (session && isAuthPath) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // 에러 발생 시 로그인 페이지로 리다이렉트
    if (req.nextUrl.pathname !== '/login') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
    return res
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}