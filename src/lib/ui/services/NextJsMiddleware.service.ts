import { NextRequest, NextResponse } from 'next/server';

export class NextJsMiddlewareService {
  static async handle(request: NextRequest): Promise<NextResponse> {
    const token = request.cookies.get('token');
    const nextUrl = request.nextUrl;

    if (!token) {
      if (nextUrl.pathname === '/login') return NextResponse.next();

      const url = nextUrl.clone();
      url.pathname = '/login';

      return NextResponse.redirect(url);
    }

    if (nextUrl.pathname === '/login' || nextUrl.pathname === '/') {
      const url = nextUrl.clone();
      url.pathname = '/dashboard';

      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }
}
